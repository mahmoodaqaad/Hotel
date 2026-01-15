"use client"

import React from 'react'
import Booking_list from '@/components/WebSite/Rooms/SinglePage/Booking-list/Booking-list'
import MyGallery from '@/components/WebSite/Rooms/SinglePage/Image_gallery/Image_gallery'
import SavePage from '@/components/WebSite/Rooms/SinglePage/SavePage/SavePage'
import Rating from '@/utils/Rating'
import { RoomWithReltionAll } from '@/utils/Types'
import { BookingRequest, Saved, User } from '@prisma/client'
import { HiUserGroup, HiHome, HiCurrencyDollar, HiArrowsExpand, HiMap } from 'react-icons/hi'

interface Props {
    room: RoomWithReltionAll & {
        bookingRequests: BookingRequest[]
    }
    user: User
}

const ShowDetalits = ({ room, user }: Props) => {
    const roomFeatures = [
        { label: 'Capacity', value: `${room.guest} Guests`, icon: HiUserGroup },
        { label: 'Room Type', value: room.roomType, icon: HiHome },
        { label: 'Price', value: `$${room.price} / Night`, icon: HiCurrencyDollar },
        { label: 'Size', value: `${room.size} m²`, icon: HiArrowsExpand },
        { label: 'View', value: room.view, icon: HiMap },
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-0">
            {/* Left Column: Image Gallery */}
            <div className="w-full lg:w-1/2 p-4 md:p-8">
                <div className="rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/5 h-full min-h-[400px]">
                    <MyGallery images={room.images} />
                </div>
            </div>

            {/* Right Column: Room Info */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
                <div className="flex items-start justify-between flex-col md:flex-row mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <Rating ava={room.averageRating} />
                            <span className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">
                                Verified Luxury
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            {room.name}
                        </h1>
                    </div>
                    <div className="shrink-0 pt-2">
                        <SavePage room={room} user={user as User & { Saved: Saved[] }} />
                    </div>
                </div>

                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed max-w-2xl">
                    {room.discrption}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {roomFeatures.map((feature, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">
                            <feature.icon className="text-2xl text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{feature.label}</h3>
                            <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{feature.value}</p>
                        </div>
                    ))}
                </div>

                {/* Booking Action */}
                <div className="mt-auto pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Price starting from</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">${room.price}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-bold">/ night</span>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <Booking_list room={room} user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowDetalits
