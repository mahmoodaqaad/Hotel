"use client"

import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import Search from '../SearchShow/Search'
import { useRouter } from 'next/navigation'

const SearchRoom = () => {
    const [search, setSearch] = useState("")
    const [result, setResult] = useState([])
    const router = useRouter()

    useEffect(() => {
        const handleSearch = async () => {
            try {
                const res = await axios.post(`${DOMAIN}/api/rooms/search`, { search })
                setResult(res.data)
            } catch (error) {
                console.error(error);
            }
        }

        let timeOut: NodeJS.Timeout
        if (search.trim()) {
            timeOut = setTimeout(() => {
                handleSearch()
            }, 300);
        } else {
            setResult([])
        }
        return () => clearTimeout(timeOut)
    }, [search])

    const handleSearchOnClick = () => {
        if (!search.trim()) return
        router.push(`/rooms/search?search=${search.trim()}`)
    }

    return (
        <div className='max-w-xl mx-auto mb-12 px-4'>
            <div className='relative group z-40'>
                <div className='flex items-center bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all'>
                    <div className="flex-1 relative">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchOnClick()}
                            type="text"
                            className='bg-transparent border-none py-3 px-4 w-full outline-none text-slate-700 dark:text-white placeholder:text-slate-400 font-medium'
                            placeholder='Search your perfect room...'
                        />
                        <Search result={result} />
                    </div>
                    <button
                        onClick={handleSearchOnClick}
                        className='bg-blue-600 p-3.5 rounded-xl text-white hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/30'
                    >
                        <BiSearch size={22} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchRoom
