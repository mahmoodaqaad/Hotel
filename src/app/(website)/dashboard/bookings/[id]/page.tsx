import { getSingleBooking } from '@/services/bookings'
import { notFound } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import { HiCalendar, HiCreditCard, HiUser, HiOfficeBuilding, HiCash, HiCheckCircle } from 'react-icons/hi'
import Link from 'next/link'

interface BookingDetailsProps {
    params: Promise<{ id: string }>
}

const BookingDetailsPage = async ({ params }: BookingDetailsProps) => {
    const { id } = await params;
    const booking = await getSingleBooking(id)

    if (!booking) return notFound()

    const startDate = new Date(booking?.checkIn).toLocaleDateString()
    const endDate = new Date(booking?.checkOut).toLocaleDateString()
    const diffTime = Math.abs(new Date(booking?.checkOut).getTime() - new Date(booking?.checkIn).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isPaid = booking?.payment && booking?.payment.status === 'paid';

    return (
        <section className="min-h-screen p-6 md:p-10 container mx-auto">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Booking #{booking?.id}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPaid ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                {isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Created at {new Date(booking?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Link href="/dashboard/bookings" className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Back to List
                    </Link>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Room Card */}
                        <div className="premium-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                {booking?.room.images[0] ? (
                                    <Image
                                        src={booking?.room.images[0].imageUrl}
                                        alt={booking?.room.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                        <HiOfficeBuilding size={32} className="text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{booking?.room.name}</h3>
                                    <p className="text-blue-500 font-black text-lg">${Number(booking?.room.price)} <span className="text-slate-400 text-sm font-medium">/ night</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check In</p>
                                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                                            <HiCalendar className="text-blue-500" /> {startDate}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check Out</p>
                                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                                            <HiCalendar className="text-red-500" /> {endDate}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Total Duration: <span className="text-slate-900 dark:text-white font-bold">{diffDays} Nights</span>
                                </div>
                            </div>
                        </div>

                        {/* Guest Info */}
                        <div className="premium-card p-6 md:p-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                                <HiUser className="text-blue-500" /> Guest Details
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                                    {booking?.user?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{booking?.user.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{booking?.user?.email}</p>
                                    <Link href={`/dashboard/users/edit/${booking?.user?.id}`} className="text-xs font-bold text-blue-500 hover:underline mt-1 inline-block">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment & Status */}
                    <div className="space-y-8">
                        <div className="premium-card p-6 md:p-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                                <HiCreditCard className="text-blue-500" /> Payment Summary
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Price per night</span>
                                    <span className="font-bold text-slate-900 dark:text-white">${Number(booking?.room.price)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Nights</span>
                                    <span className="font-bold text-slate-900 dark:text-white">x {diffDays}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-slate-900 dark:text-white font-black text-lg">Total</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-black text-2xl">${Number(booking?.totalAmount)}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                                {isPaid ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl">
                                            <HiCheckCircle size={24} />
                                            <div>
                                                <p className="font-bold">Payment Confirmed</p>
                                                <p className="text-xs opacity-80">via Credit Card</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl">
                                            <HiCash size={24} />
                                            <div>
                                                <p className="font-bold">Payment Pending</p>
                                                <p className="text-xs opacity-80">Waiting for guest</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default BookingDetailsPage
