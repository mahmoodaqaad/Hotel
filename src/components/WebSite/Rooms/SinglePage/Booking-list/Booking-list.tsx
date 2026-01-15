"use client"

import { DOMAIN } from '@/utils/consant'
import { Booking, BookingRequest, Room, User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiX, HiCalendar, HiCheckCircle, HiChevronRight } from 'react-icons/hi'
import { toast } from 'react-toastify'
// dynamic import
import { motion, AnimatePresence } from 'framer-motion'

const Booking_list = ({ room, user }: { room: Room & { bookingRequests: BookingRequest[], bookings?: Booking[] }, user: User }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [loading, setLoading] = useState(false)

  const BookRequest = room.bookingRequests.find(item => item.roomId === room.id && item.userId === user.id)
  const ActiveBooking = room.bookings?.find(item => item.roomId === room.id && item.userId === user.id && item.status === "active")

  const hasActiveBooking = !!BookRequest || !!ActiveBooking
  const [isBooked, setIsBooked] = useState(hasActiveBooking) // If BookRequest or ActiveBooking exists, show it

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (!user?.id) {
      toast.error("Please login to book a room")
      return router.push("/login")
    }

    if (!checkIn || !checkOut) {
      return toast.error("Please select both check-in and check-out dates")
    }

    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      return toast.error("Check-out date must be after check-in date")
    }

    try {
      setLoading(true)
      setIsBooked(true)
      setShowModal(false)

      await axios.post(`${DOMAIN}/api/booking-requests`, {
        userId: user?.id,
        roomId: room.id,
        checkIn,
        checkOut
      })

      const Swal = (await import('sweetalert2')).default
      Swal.fire({
        title: "Booking Request Sent!",
        text: "We have received your request and will get back to you soon.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: 'rounded-[1.5rem] dark:bg-slate-900 dark:text-white',
          title: 'font-bold tracking-tight text-2xl',
          confirmButton: 'rounded-xl font-bold py-3 px-8'
        }
      })
    } catch (error) {
      setIsBooked(false)
      console.error(error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBook = async () => {
    const Swal = (await import('sweetalert2')).default
    const result = await Swal.fire({
      title: "Cancel Booking Request?",
      text: "Are you sure you want to cancel your request for this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, cancel it",
      customClass: {
        popup: 'rounded-[1.5rem] dark:bg-slate-900 dark:text-white',
        title: 'font-bold tracking-tight',
        confirmButton: 'rounded-xl font-bold py-3 px-6',
        cancelButton: 'rounded-xl font-bold py-3 px-6'
      }
    })

    if (result.isConfirmed) {
      try {
        await axios.patch(`${DOMAIN}/api/booking-requests/status/${BookRequest?.id}`)
        setIsBooked(false)
        toast.success("Booking request cancelled")
      } catch (error) {
        console.error(error)
        toast.error("Failed to cancel request")
      }
    }
  }
  console.log(user);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reserve Room</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400"
                  >
                    <HiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleBook} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <HiCalendar size={20} />
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Check-In</div>
                      <input
                        type="date"
                        required
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <HiCalendar size={20} />
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Check-Out</div>
                      <input
                        type="date"
                        required
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <HiCheckCircle size={20} className="shrink-0" />
                      <span>Request will be sent to our management for immediate review.</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Reserve Now
                        <HiChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {ActiveBooking ? (
        <motion.div
          className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold py-4 px-8 rounded-2xl border border-blue-200 dark:border-blue-500/20 flex items-center gap-3"
        >
          <HiCheckCircle size={24} className="text-blue-600 dark:text-blue-400" />
          <div>
            <div className="font-bold">You have an active booking</div>
            <div className="text-sm font-normal opacity-80">Check your profile to view booking details</div>
          </div>
        </motion.div>
      ) : isBooked ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancelBook}
          className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold py-4 px-8 rounded-2xl border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center gap-2"
        >
          <HiX size={20} />
          Cancel Reservation
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 group"
        >
          Book This Room
          <HiChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </>
  )
}

export default Booking_list
