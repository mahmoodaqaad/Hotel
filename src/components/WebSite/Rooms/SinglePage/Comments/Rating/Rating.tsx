"use client"

import { DOMAIN } from '@/utils/consant'
import { Room, User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiStar } from 'react-icons/hi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const Rating = ({ room, user }: { room: Room, user: User }) => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRating = async () => {
        if (rating === 0) return toast.error("Please select a rating")
        if (!user) return toast.error("Please login to rate")

        try {
            setLoading(true)
            await axios.post(`${DOMAIN}/api/Rating`, { roomId: room.id, userId: user.id, rating })

            Swal.fire({
                title: "Rating Received!",
                text: "Thank you for your valuable feedback.",
                icon: "success",
                confirmButtonColor: "#3b82f6",
                customClass: {
                    popup: 'rounded-[1.5rem] dark:bg-slate-900 dark:text-white',
                    title: 'font-bold tracking-tight'
                }
            })
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to submit rating")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-white dark:bg-slate-800/40 p-6 rounded-3xl ring-1 ring-slate-100 dark:ring-white/5 shadow-sm">
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        className="p-1 focus:outline-none transition-colors"
                    >
                        <HiStar
                            size={40}
                            className={`${(hover || rating) >= star
                                    ? "text-yellow-400 fill-current"
                                    : "text-slate-200 dark:text-slate-700"
                                } transition-colors drop-shadow-sm`}
                        />
                    </motion.button>
                ))}
            </div>

            <div className="flex-1 w-full sm:w-auto">
                <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-sm font-bold mb-4">
                    {rating > 0 ? `You selected ${rating} stars` : "Select a star to rate"}
                </p>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRating}
                    disabled={loading || rating === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 h-[52px]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "Submit Rating"}
                </motion.button>
            </div>
        </div>
    )
}

export default Rating