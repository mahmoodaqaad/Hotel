"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiArrowRight, HiCalendar, HiUserGroup, HiHome } from 'react-icons/hi'
import { toast } from 'react-toastify'

const BookRoomTime = () => {
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [type, setType] = useState("")
    const [guest, setGuest] = useState("")
    const router = useRouter()

    const handleBook = async () => {
        if (!checkIn || !checkOut || !type || !guest) return toast.error("Please fill all fields")
        if (new Date(checkOut).getTime() - new Date(checkIn).getTime() <= 0) return toast.error("Check-out must be after Check-in")

        const guestNum = Number(guest)
        if ((type === "Single" && guestNum > 1) || (type === "Double" && guestNum > 2) || (type === "Deluxe" && guestNum > 3)) {
            return toast.error("Room type doesn't match guest count")
        }

        router.push(`/RoomFilter?checkIn=${checkIn}&checkOut=${checkOut}&type=${type}&guest=${guest}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='glass-card bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] p-4 lg:p-6 border border-white/20 relative z-40'
        >
            <div className='flex flex-col lg:flex-row items-center gap-6'>
                {/* Check In/Out */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            <HiCalendar className="text-blue-500" /> Check In
                        </label>
                        <input
                            value={checkIn}
                            onChange={e => setCheckIn(e.target.value)}
                            type="date"
                            className='w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none'
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            <HiCalendar className="text-blue-500" /> Check Out
                        </label>
                        <input
                            value={checkOut}
                            onChange={e => setCheckOut(e.target.value)}
                            type="date"
                            className='w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none'
                        />
                    </div>
                </div>

                {/* Room Type */}
                <div className="w-full lg:w-48 space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                        <HiHome className="text-blue-500" /> Room Type
                    </label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className='w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer appearance-none'
                    >
                        <option value="" disabled>Select Room</option>
                        <option value="Single">Single Room</option>
                        <option value="Double">Double Room</option>
                        <option value="Deluxe">Deluxe Room</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Guests */}
                <div className="w-full lg:w-40 space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                        <HiUserGroup className="text-blue-500" /> Guests
                    </label>
                    <select
                        value={guest}
                        onChange={e => setGuest(e.target.value)}
                        className='w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3 px-4 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer appearance-none'
                    >
                        <option value="" disabled>Select Guest</option>
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <>
                                <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                            </>
                        ))}
                    </select>
                </div>

                {/* Button */}
                <div className="w-full lg:w-auto pt-2 lg:pt-6">
                    <button
                        onClick={handleBook}
                        className='w-full lg:w-16 h-14 bg-blue-600 hover:bg-black dark:hover:bg-white dark:hover:text-black text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-500/20 group'
                    >
                        <HiArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default BookRoomTime

