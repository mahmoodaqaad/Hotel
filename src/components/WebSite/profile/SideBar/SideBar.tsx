"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import { HiHome, HiBookOpen, HiClipboardList, HiBookmark, HiChatAlt2, HiUserCircle, HiLockClosed } from 'react-icons/hi'

const profileLinks = [
  { label: "Overview", icon: HiHome, href: "/profile" },
  { label: "My Bookings", icon: HiBookOpen, href: "/profile/booking", mobileLabel: "Bookings" },
  { label: "Booking Requests", icon: HiClipboardList, href: "/profile/requests", mobileLabel: "Requests" },
  { label: "Saved Rooms", icon: HiBookmark, href: "/profile/saved", mobileLabel: "Saved" },
  { label: "My Comments", icon: HiChatAlt2, href: "/profile/comments", mobileLabel: "Comments" },
  { label: "Edit Profile", icon: HiUserCircle, href: "/profile/edit", hideMobile: true },
  { label: "Security", icon: HiLockClosed, href: "/profile/changePassword", hideMobile: true }
];

const SideBar = () => {
  const pathname = usePathname()

  return (
    <aside className="fixed bottom-0 left-0 w-full z-40 md:sticky md:top-[120px] md:w-full md:h-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none border-t border-slate-200 dark:border-white/10 md:border-none">
      <div className="md:bg-white dark:md:bg-slate-900/50 md:shadow-2xl md:shadow-slate-200/50 dark:md:shadow-none md:rounded-[2.5rem] md:p-6 md:ring-1 md:ring-slate-100 dark:md:ring-white/5 overflow-hidden">
        <h2 className="hidden md:block text-2xl font-bold text-slate-900 dark:text-white mb-8 px-4 tracking-tight">Account</h2>

        <nav className="flex md:flex-col justify-around md:justify-start">
          {profileLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className={`group w-full ${link.hideMobile ? 'hidden md:block' : ''}`}>
                <div className={`relative flex flex-col md:flex-row items-center gap-1 md:gap-4 py-4 md:py-3.5 px-4 md:px-6 transition-all duration-300 ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 md:rounded-2xl z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <link.icon className={`relative z-10 text-xl md:text-2xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                  <span className={`relative z-10 text-[10px] md:text-sm font-bold tracking-tight md:tracking-normal ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    <span className="hidden md:inline">{link.label}</span>
                    <span className="md:hidden">{link.mobileLabel || link.label}</span>
                  </span>

                  {isActive && (
                    <div className="hidden md:block absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default SideBar
