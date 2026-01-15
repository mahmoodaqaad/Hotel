import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaRegEye } from 'react-icons/fa'

interface room {
    name: string,
    guest?: string | number,
    view?: string,
    id: number
}

const Search = ({ result }: { result: room[] }) => {
    return (
        result.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-[120%] md:w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-2 absolute z-50 max-h-[420px] overflow-y-auto rounded-2xl shadow-2xl backdrop-blur-xl'
            >
                <div className="p-2 space-y-1">
                    {result.map((item, i) => (
                        <Link
                            href={`/rooms/${item.id}`}
                            key={i}
                            className='block p-4 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 group'
                        >
                            <h1 className='text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors'>
                                {item.name}
                            </h1>

                            <div className='mt-2 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400'>
                                {item.guest && (
                                    <div className="flex items-center gap-1.5">
                                        <FaUser className="text-blue-500/70" size={10} />
                                        <span>{item.guest} Persons</span>
                                    </div>
                                )}
                                {item.view && (
                                    <div className="flex items-center gap-1.5">
                                        <FaRegEye className="text-teal-500/70" size={12} />
                                        <span>{item.view}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        )
    )
}

export default Search

