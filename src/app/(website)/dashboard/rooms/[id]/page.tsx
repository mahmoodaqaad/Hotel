
import { getSingleRoom } from '@/services/rooms'
import { notFound } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import { HiStar, HiOfficeBuilding, HiPencilAlt, HiUserGroup, HiEye } from 'react-icons/hi'
import Link from 'next/link'

interface SingleRoomProps {
    params: Promise<{ id: string }>
}

const SingleRoom = async ({ params }: SingleRoomProps) => {
    const { id } = await params;
    const room = await getSingleRoom(id)

    if (!room) return notFound()

    return (
        <section className="min-h-screen p-6 md:p-10 container mx-auto">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            {room.name}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${room.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                {room.status}
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider text-xs">
                            ID: {room.id} • Added on {new Date(room.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/rooms/edit/${room.id}`} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                            <HiPencilAlt size={20} /> Edit Room
                        </Link>
                        <Link href={`/rooms/${room.id}`} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <HiEye size={20} /> View Live
                        </Link>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Images & Desc */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Gallery */}
                        <div className="premium-card p-4 overflow-hidden">
                            <div className="grid grid-cols-2 gap-4">
                                {room.images.slice(0, 4).map((img, index) => (
                                    <div key={img.id} className={`relative rounded-xl overflow-hidden shadow-sm aspect-video ${index === 0 ? 'col-span-2 aspect-[21/9]' : ''}`}>
                                        <Image
                                            src={img.imageUrl}
                                            alt={room.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="premium-card p-6 md:p-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Description</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {room.discrption}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="premium-card p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                    <HiStar size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{room.averageRating}</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Avg Rating</p>
                                </div>
                            </div>
                            <div className="premium-card p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <HiUserGroup size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{room.totalRatings}</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Total Reviews</p>
                                </div>
                            </div>
                            <div className="premium-card p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                                    <HiOfficeBuilding size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white capitalize truncate">{room.view}</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase">View Type</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="space-y-8">
                        <div className="premium-card p-6 md:p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                                <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase">Price per Night</span>
                                <span className="text-4xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                    {Number(room.price)}<span className="text-lg text-slate-400 font-medium">$</span>
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Guests</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{room.guest} Person(s)</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room View</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{room.view}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests */}
                        <div className="premium-card p-6">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Pending Requests</h3>
                            {room.bookingRequests && room.bookingRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {room.bookingRequests.slice(0, 3).map(req => (
                                        <Link href={`/dashboard/bookings?type=request`} key={req.id} className="block p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-500">Request #{req.id}</span>
                                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href="/dashboard/booking-requests" className="block text-center text-xs font-bold text-blue-500 hover:text-blue-600 pt-2">
                                        View All Requests
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 font-medium">No pending requests.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default SingleRoom
