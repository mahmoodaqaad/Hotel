"use client"

import { Notification, User, Role } from "@prisma/client";
import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import useSWR from "swr";
import { supabase } from "@/utils/supabase";

interface SocketContextProviderType {
    notifications: Notification[]
    setNotification: React.Dispatch<React.SetStateAction<Notification[]>>
    myUser: User | undefined
    setMyUser: React.Dispatch<React.SetStateAction<User | undefined>>
    onlineUsers: (Partial<User> & { lastSeen?: Date })[]
}

export const SocketContext = createContext<SocketContextProviderType | undefined>(undefined)

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotification] = useState<Notification[]>([])
    const [myUser, setMyUser] = useState<User | undefined>(undefined)
    const [onlineUsers, setOnlineUsers] = useState<(Partial<User> & { lastSeen?: Date })[]>([])

    // 1. Initial and Periodic Fetch (Prisma-backed API)
    const { data: fetchedNotifications } = useSWR(
        myUser?.id ? `/api/notifications?userId=${myUser.id}` : null,
        fetcher,
        { refreshInterval: 30000, revalidateOnFocus: true } // Slower polling as backup
    );

    useEffect(() => {
        if (fetchedNotifications) {
            setNotification(fetchedNotifications);
        }
    }, [fetchedNotifications]);

    // 2. Supabase Realtime (Broadcast and Presence)
    useEffect(() => {
        if (!myUser?.id) {
            setNotification([]);
            setOnlineUsers([]);
            return;
        }

        // --- Broadcast Notifications ---
        const notificationChannel = supabase.channel(`notifications-${myUser.id}`, {
            config: {
                broadcast: { self: false },
            },
        }).on(
            'broadcast',
            { event: 'new-notification' },
            (payload) => {
                const newNotification = payload.payload as Notification;
                setNotification((prev) => [newNotification, ...prev]);
            }
        )
            .subscribe();

        // --- Realtime Presence (Active Users) ---
        const presenceChannel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: myUser.id.toString(),
                },
            },
        });


        
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const users: (Partial<User> & { lastSeen?: Date })[] = [];

                for (const id in state) {
                    const presence = (state[id] as unknown as { id: string, name: string, role: string, lastSeen: string }[])[0];
                    if (presence) {
                        users.push({
                            id: Number(presence.id),
                            name: presence.name,
                            role: presence.role as Role,
                            lastSeen: new Date(presence.lastSeen),
                        });
                    }
                }
                setOnlineUsers(users);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        id: myUser.id,
                        name: myUser.name,
                        role: myUser.role,
                        lastSeen: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(notificationChannel);
            supabase.removeChannel(presenceChannel);
        };
    }, [myUser?.id, myUser?.name, myUser?.role]);



    return (
        <SocketContext.Provider value={{
            notifications,
            setNotification,
            myUser,
            setMyUser,
            onlineUsers
        }} >
            {children}
        </SocketContext.Provider>
    )
}
