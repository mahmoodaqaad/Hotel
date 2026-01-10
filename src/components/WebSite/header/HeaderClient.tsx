"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle } from 'react-icons/fa'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import ThemeMode from '@/components/Dashboard/NavBarDashboard/ThemeMode'
import Logout from '@/components/Auth/Logout/Logout'
import Notifiction from '@/components/Notifiction/Notifiction'
import { User, Notification } from '@prisma/client'
import { socket } from '@/lib/socketClints'
import { IsSuperAdminOrAdminOrManagerPage } from '@/utils/roles'

import { usePathname } from 'next/navigation'

interface HeaderClientProps {
    user: (User & { Notification: Notification[] }) | null
}

const HeaderClient = ({ user }: HeaderClientProps) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Only "Home" page has a transparent hero section
    const isHomePage = pathname === '/'

    // Determine active state: Scrolled OR Not on Home Page
    // If we are NOT on home page, we always want the "scrolled" (solid) style
    const isSolid = isScrolled || !isHomePage

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)

        if (user) {
            socket.emit("addNewUser", user)
        }

        return () => window.removeEventListener('scroll', handleScroll)
    }, [user])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Our Rooms', href: '/rooms' },
        { name: 'Restaurant', href: '/restaurant' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isSolid
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg py-3 shadow-lg'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-50 group">
                    <h1 className={`text-2xl font-bold tracking-tighter transition-colors duration-300 ${isSolid ? 'text-slate-900 dark:text-white' : 'text-white'
                        }`}>
                        Harbor<span className="text-blue-500">Lights</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-all hover:text-blue-500 ${isSolid
                                ? 'text-slate-600 dark:text-slate-300'
                                : 'text-white/80 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-3 lg:space-x-5">
                    <div className={isSolid ? 'text-slate-700 dark:text-slate-300' : 'text-white'}>
                        <ThemeMode />
                    </div>

                    {user && <Notifiction user={user} />}


                    {user ? (
                        <div className="flex items-center space-x-3">
                            <Link
                                href={user.role === "User" ? "/profile" : "/dashboard/profile"}
                                className="group relative"
                            >
                                <FaUserCircle className={`text-3xl transition-all group-hover:scale-110 ${isSolid ? 'text-slate-700 dark:text-slate-300' : 'text-white'
                                    }`} />
                            </Link>

                            {IsSuperAdminOrAdminOrManagerPage(user.role) && (
                                <Link
                                    href="/dashboard"
                                    className="hidden md:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-all"
                                >
                                    Dashboard
                                </Link>
                            )}

                            <div className="hidden md:block">
                                <Logout />
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/login"
                                className={`text-sm font-medium ${isSolid ? 'text-slate-600 dark:text-slate-300' : 'text-white/80'
                                    }`}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`lg:hidden text-2xl z-50 ${isSolid ? 'text-slate-900 dark:text-white' : 'text-white'
                            }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white dark:bg-slate-900 z-40 lg:hidden flex flex-col p-8 pt-24"
                    >
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-semibold text-slate-800 dark:text-white hover:text-blue-500 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-4" />
                            {user ? (
                                <div className="space-y-4">
                                    <Link
                                        href={user.role === "User" ? "/profile" : "/dashboard/profile"}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-3 text-slate-600 dark:text-slate-300"
                                    >
                                        <FaUserCircle className="text-2xl" />
                                        <span>Account Settings</span>
                                    </Link>
                                    {IsSuperAdminOrAdminOrManagerPage(user.role) && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-semibold"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    )}
                                    <div className="pt-4">
                                        <Logout />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4 pt-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-4 text-center text-slate-600 dark:text-slate-300 font-semibold"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-4 bg-blue-600 text-white text-center rounded-xl font-semibold shadow-lg shadow-blue-500/30"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default HeaderClient
