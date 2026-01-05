"use client"

import { DashboardContext } from '@/Context/DashboardContext'
import React, { useContext } from 'react'
import { HiMenuAlt2 } from 'react-icons/hi'
import { motion } from 'framer-motion'

const Bar = () => {
    const context = useContext(DashboardContext)

    if (!context) {
        throw new Error("Bar component must be used within a DashboardContextProvider")
    }

    const { showSidebar, setShowSidebar } = context

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={showSidebar ? "Collapse Sidebar" : "Expand Sidebar"}
        >
            <HiMenuAlt2 size={24} />
        </motion.button>
    )
}

export default Bar
