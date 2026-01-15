"use client"

import Logout from '@/components/Auth/Logout/Logout'
import Link from 'next/link'
import React, { useContext } from 'react'
import { HiUser, HiOutlineGlobeAlt, HiSearch, HiStatusOnline } from 'react-icons/hi'
import Bar from './Bar'
import ThemeMode from './ThemeMode'
import { User, Notification as PrismaNotification } from '@prisma/client'
import Notifiction from '@/components/Notifiction/Notifiction'
import SearchInput from './SearchInput'
import { SocketContext } from '@/Context/SocketContext'

const NavBarDashboard = ({ user }: { user: User & { Notification: PrismaNotification[] } }) => {
    const socket = useContext(SocketContext)
    const onlineCount = socket?.onlineUsers.length || 0

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-3 px-6 md:px-10">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Bar />
                    <div className="hidden sm:flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
                        Admin Portal <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-slate-900 dark:text-white">{user?.role}</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                    <HiStatusOnline className="text-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                        {onlineCount} ACTIVE
                    </span>
                </div>

                <div className="flex-1 max-w-xl hidden md:block z-50">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <HiSearch size={20} />
                        </div>
                        <SearchInput />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl">
                        <Link href="/" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all font-bold text-xs flex items-center gap-2">
                            <HiOutlineGlobeAlt size={20} />
                            <span className="hidden lg:block uppercase tracking-widest">Site</span>
                        </Link>
                        <ThemeMode />
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-white/5 mx-1" />


                    <Link href="/dashboard/profile" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400 transition-all group-hover:shadow-lg group-hover:shadow-slate-200/50 dark:group-hover:shadow-none group-hover:ring-2 group-hover:ring-blue-500/20">
                            <HiUser size={24} />
                        </div>
                    </Link>

                    <div className="hidden sm:block">
                        <Logout />
                    </div>
                    {user && <Notifiction user={user} />}
                </div>
            </div>
        </header>
    )
}

export default NavBarDashboard
