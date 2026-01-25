"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { HiUser, HiOfficeBuilding, HiCalendar, HiOutlineExternalLink } from 'react-icons/hi'
import axios from 'axios'
import { DOMAIN } from '@/utils/consant'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SearchResults {
    users: { id: string; name: string; email: string; role: string }[]
    rooms: { id: string; name: string; price: number; images: { imageUrl: string }[] }[]
    bookings: { id: string; startDate: string; endDate: string; user: { name: string }; room: { name: string } }[]
}

const SearchInput = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResults | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults(null)
                return
            }
            setIsLoading(true)
            try {
                const { data } = await axios.get(`${DOMAIN}/api/dashboard/search?q=${query}`)
                setResults(data)
                setIsOpen(true)
            } catch (error) {
                console.error("Search failed", error)
            } finally {
                setIsLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchResults, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    return (
        <div ref={containerRef} className="w-full relative">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search users, rooms, bookings..."
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-transparent rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />

            <AnimatePresence>
                {isOpen && (results || isLoading) && (query.length >= 2) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden ring-1 ring-slate-900/5 z-50 max-h-[80vh] overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
                        ) : (
                            <>
                                {(results?.users?.length || 0) === 0 && (results?.rooms?.length || 0) === 0 && (results?.bookings?.length || 0) === 0 ? (
                                    <div className="p-4 text-center text-slate-400 text-sm">No results found.</div>
                                ) : (
                                    <div className="py-2">
                                        {/* Users Section */}
                                        {(results?.users?.length || 0) > 0 && (
                                            <div className="px-2 mb-2">
                                                <h3 className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                    <HiUser /> Users
                                                </h3>
                                                {results?.users.map(user => (
                                                    <Link
                                                        href={`/dashboard/users/edit/${user.id}`}
                                                        key={user.id}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                                                        </div>
                                                        <HiOutlineExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Rooms Section */}
                                        {(results?.rooms?.length || 0) > 0 && (
                                            <>
                                                <div className="h-px bg-slate-100 dark:bg-white/5 mx-4 my-2" />
                                                <div className="px-2 mb-2">
                                                    <h3 className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                        <HiOfficeBuilding /> Rooms
                                                    </h3>
                                                    {results?.rooms.map(room => (
                                                        <Link
                                                            href={`/dashboard/rooms/${room.id}`}
                                                            key={room.id}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                                        >
                                                            {room.images && room.images[0] ? (
                                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                                                                    <Image
                                                                        src={room.images[0].imageUrl}
                                                                        alt=""
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                                    <HiOfficeBuilding className="text-slate-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{room.name}</div>
                                                                <div className="text-xs font-bold text-green-500">${room.price}/night</div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {/* Bookings Section */}
                                        {(results?.bookings?.length || 0) > 0 && (
                                            <>
                                                <div className="h-px bg-slate-100 dark:bg-white/5 mx-4 my-2" />
                                                <div className="px-2">
                                                    <h3 className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                        <HiCalendar /> Bookings
                                                    </h3>
                                                    {results?.bookings.map(booking => (
                                                        <Link
                                                            href={`/dashboard/bookings/${booking.id}`}
                                                            key={booking.id}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                                                <HiCalendar size={14} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                                    {booking.user.name} • {booking.room.name}
                                                                </div>
                                                                <div className="text-xs text-slate-500 truncate">ID: #{booking.id}</div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SearchInput
