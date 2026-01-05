"use client"

import React, { useEffect, useState } from 'react'
import SingleRoom from './SingleRoom/SingleRoom'
import SearchRoom from './SearchRoom/SearchRoom'
import { RoomWithReltionAll } from '@/utils/Types'
import { LoadingBtn } from '@/app/loading'
import axios from 'axios'
import { DOMAIN } from '@/utils/consant'
import { motion, AnimatePresence } from 'framer-motion'

const Rooms = ({ count }: { count: number }) => {
    const [rooms, setRooms] = useState<RoomWithReltionAll[]>([])
    const [offset, setOffset] = useState(1)
    const [loading, setLoading] = useState(false)
    const [lastOn, setLastOn] = useState(false)

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${DOMAIN}/api/rooms?pageNumber=${offset}`)

                if (offset === 1) {
                    setRooms(res.data)
                } else {
                    setRooms(prev => [...prev, ...res.data])
                }

                if (rooms.length + res.data.length >= count) {
                    setLastOn(true)
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }

        if (!lastOn || offset === 1) {
            fetchRooms()
        }
    }, [offset, count, lastOn, rooms.length])

    return (
        <div className='container mx-auto px-6 py-12'>
            <div className="mb-16 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
                >
                    Our Premium Suites
                </motion.h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-8" />
                <SearchRoom />
            </div>

            <motion.div
                layout
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            >
                <AnimatePresence>
                    {rooms.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <SingleRoom room={item} booking={true} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {!lastOn && rooms.length > 0 && (
                <div className="mt-16 text-center">
                    <button
                        onClick={() => setOffset(offset + 1)}
                        className='px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50'
                        disabled={loading}
                    >
                        {loading ? <LoadingBtn /> : "Load More Experiences"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Rooms

