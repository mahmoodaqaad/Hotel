"use client"

import React, { useContext } from 'react'
import { SocketContext } from '@/Context/SocketContext'
import { motion } from 'framer-motion'
import { HiUser, HiStatusOnline } from 'react-icons/hi'

const OnlineUsersPage = () => {
    const context = useContext(SocketContext)

    if (!context) return null
    const { onlineUsers } = context

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Active <span className="text-blue-600">Users</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Real-time presence tracking via Supabase
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <div className="relative">
                        <HiStatusOnline className="text-blue-600 dark:text-blue-400 text-2xl animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </div>
                    <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">
                        {onlineUsers.length} Users Online
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineUsers.map((user, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={user.id}
                        className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                <HiUser size={32} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">
                                    {user.name || "Anonymous User"}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' :
                                            user.role === 'Admin' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                                Last activity: {user.lastSeen ? new Date(user.lastSeen).toLocaleTimeString() : 'Just now'}
                            </span>
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500"></div>
                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {onlineUsers.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-100/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                        <div className="w-20 h-20 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <HiUser size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No users active</h3>
                        <p className="text-slate-500 dark:text-slate-400">Tracking real-time sessions...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OnlineUsersPage
