"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { FaExpandAlt, FaUser, FaRegEye } from 'react-icons/fa'
import Link from 'next/link'
import { RoomWithReltionAll } from '@/utils/Types'

const SingleRoom = ({ room, booking = true }: { room: RoomWithReltionAll, booking: boolean }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className='group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all'
        >
            {/* Image Section */}
            <Link href={`/rooms/${room?.id}`} className='relative block h-[240px] overflow-hidden'>
                <Image
                    fill
                    src={room?.images?.[0]?.imageUrl || "/img/room/1.jpg"} // Fallback image
                    alt={room?.name || "Room Image"}
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 z-10">
                    {booking && room.status == "booked" ? (
                        <span className="px-3 py-1.5 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Fully Booked
                        </span>
                    ) : (
                        <span className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Available Now
                        </span>
                    )}
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-white font-bold text-lg">
                        ${Number(room.price)}<span className="text-xs font-normal opacity-70"> / night</span>
                    </p>
                </div>
            </Link>

            {/* Content Section */}
            <div className='p-6'>
                <Link href={`/rooms/${room.id}`}>
                    <h3 className='text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors'>
                        {room.name}
                    </h3>
                </Link>

                <p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6'>
                    Experience luxury in our {room.name}, featuring world-class amenities and breathtaking views.
                </p>

                <div className='grid grid-cols-3 gap-2 py-4 border-t border-slate-100 dark:border-slate-800'>
                    <div className='flex flex-col items-center gap-1.5'>
                        <FaExpandAlt className="text-blue-500/80" size={14} />
                        <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-tighter'>{room.size} m²</span>
                    </div>
                    <div className='flex flex-col items-center gap-1.5 border-x border-slate-100 dark:border-slate-800'>
                        <FaUser className="text-blue-500/80" size={14} />
                        <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-tighter'>{room.guest} Guest</span>
                    </div>
                    <div className='flex flex-col items-center gap-1.5'>
                        <FaRegEye className="text-blue-500/80" size={16} />
                        <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-tighter truncate max-w-full'>{room.view}</span>
                    </div>
                </div>

                <Link
                    href={`/rooms/${room.id}`}
                    className='mt-6 block w-full py-3 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all'
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    )
}

export default SingleRoom

