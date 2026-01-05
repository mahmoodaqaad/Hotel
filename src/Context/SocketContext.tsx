"use client"

import { socket } from "@/lib/socketClints";
import { Notification, User } from "@prisma/client";
import { createContext, useEffect, useState, ReactNode } from "react";

interface SocketContextProviderType {
    notifications: Notification[]
    setNotification: React.Dispatch<React.SetStateAction<Notification[]>>
    myUser: User | undefined
    setMyUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const SocketContext = createContext<SocketContextProviderType | undefined>(undefined)

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotification] = useState<Notification[]>([])
    const [myUser, setMyUser] = useState<User | undefined>(undefined)

    useEffect(() => {
        if (!socket || !myUser) return
        socket.emit("addNewUser", myUser)
    }, [myUser])

    useEffect(() => {
        const handleNotif = (data: Notification) => {
            setNotification(prev => [data, ...prev])
        }

        socket.on("getNotif", handleNotif)

        return () => {
            socket.off("getNotif", handleNotif)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ notifications, setNotification, myUser, setMyUser }} >
            {children}
        </SocketContext.Provider>
    )
}