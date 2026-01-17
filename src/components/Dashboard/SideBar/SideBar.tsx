"use client"

import Link from 'next/link';
import { links } from './NavLink';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardContext } from '@/Context/DashboardContext';
import { HiChevronLeft } from 'react-icons/hi';
import { User } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';

const SideBar = ({ user }: { user: User }) => {
    const context = useContext(DashboardContext)
    if (!context) throw new Error("DashboardContext missing")

    const { showSidebar, setShowSidebar } = context
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSidebar(false)}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen z-50 transition-all duration-500 ease-in-out border-r border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden ${showSidebar ? "w-72" : "w-0 lg:w-24 -translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header/Logo section */}
                    <div className="p-6 md:p-8 flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            {/* <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <HiMenuAlt2 size={24} />
                            </div> */}
                            <AnimatePresence mode="wait">
                                {showSidebar && (
                                    <motion.h2
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-black text-xl text-slate-900 dark:text-white tracking-tighter"
                                    >
                                        Harbor<span className="text-blue-600">Admin</span>
                                    </motion.h2>
                                )}
                            </AnimatePresence>
                        </Link>

                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <HiChevronLeft size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                        {links.map((link, i) => {
                            const isAllowed = link.allowedRole.includes(user.role)
                            if (!isAllowed) return null

                            const isActive = pathname === link.href || pathname === link.href.split("?")[0]


                            return (
                                <Link
                                    href={link.href}
                                    key={i}
                                    className={`relative group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isActive
                                        ? "text-white shadow-xl shadow-blue-500/25"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDashLink"
                                            className="absolute inset-0 bg-blue-600 rounded-2xl z-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <link.Icon className={`relative z-10 text-2xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />

                                    <AnimatePresence>
                                        {showSidebar && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="relative z-10 font-bold text-sm tracking-tight whitespace-nowrap"
                                            >
                                                {link.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {!showSidebar && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[60]">
                                            {link.label}
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer / User Preview */}
                    <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black">
                                {user.name.charAt(0)}
                            </div>
                            {showSidebar && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">{user.role}</p>
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default SideBar;
