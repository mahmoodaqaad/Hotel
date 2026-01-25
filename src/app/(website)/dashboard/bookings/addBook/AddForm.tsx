"use client"
import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { HiUser, HiOfficeBuilding, HiCalendar, HiArrowRight, HiCheck } from 'react-icons/hi'
import { LoadingPage } from '@/app/loading'

const AddForm = () => {

    const [userId, setUserId] = useState("")
    const [roomId, setRoomId] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState<{ name: string, id: string }[]>([])
    const [room, setRoom] = useState<{ name: string, id: string }[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, roomRes] = await Promise.all([
                    axios.get(`${DOMAIN}/api/users/name_id`),
                    axios.get(`${DOMAIN}/api/rooms/name_id`)
                ]);
                setUser(userRes.data);
                setRoom(roomRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                toast.error("Failed to load users and rooms");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const router = useRouter()

    const handleNext = () => {
        if (!userId) return toast.error("Please select a user");
        if (!roomId) return toast.error("Please select a room");
        if (!checkIn) return toast.error("Please select check-in date");
        if (!checkOut) return toast.error("Please select check-out date");

        if (new Date(checkIn) >= new Date(checkOut)) {
            return toast.error("Check-out date must be after check-in date");
        }

        router.push(`/dashboard/bookings/addBook/payment?userId=${userId}&roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`)
    }

    if (loading) return <LoadingPage />

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-8 md:p-12 text-center md:text-left"
            >
                <div className="mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Booking</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create a reservation for a guest</p>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* User Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiUser className="text-blue-500" /> Select User
                            </label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    onChange={e => setUserId(e.target.value)}
                                    value={userId}
                                >
                                    <option value="" disabled className="dark:bg-slate-900">Choose a Guest...</option>
                                    {user?.map(u => (
                                        <option value={u.id} key={u.id} className="dark:bg-slate-900">{u?.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <HiCheck size={20} className={userId ? "opacity-100" : "opacity-0"} />
                                </div>
                            </div>
                        </div>

                        {/* Room Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiOfficeBuilding className="text-blue-500" /> Select Room
                            </label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    onChange={e => setRoomId(e.target.value)}
                                    value={roomId}
                                >
                                    <option value="" disabled className="dark:bg-slate-900">Choose a Room...</option>
                                    {room?.map(r => (
                                        <option value={r.id} key={r.id} className="dark:bg-slate-900">{r.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <HiCheck size={20} className={roomId ? "opacity-100" : "opacity-0"} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Check In */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiCalendar className="text-blue-500" /> Check In Date
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                value={checkIn}
                                onChange={e => setCheckIn(e.target.value)}
                            />
                        </div>

                        {/* Check Out */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiCalendar className="text-blue-500" /> Check Out Date
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                value={checkOut}
                                onChange={e => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
                        <button
                            type="button"
                            onClick={handleNext}
                            className="group relative w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span>Proceed to Payment</span>
                            <HiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default AddForm
