"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoReload } from 'react-icons/io5'

const SearchTable = ({ path }: { path: string }) => {
    const params = useSearchParams()

    const [search, setSearch] = useState(params.get("search") || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)
            if (!search.trim()) {
                setSearch("")
                return router.push(`/dashboard/${path}?pageNumber=1`)
            }
            router.push(`/dashboard/${path}?search=${search.trim()}`)
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false)
        }
    }

    const handleReset = (e: React.MouseEvent) => {
        try {
            e.preventDefault()
            router.push(`/dashboard/${path}?pageNumber=1`)
            setSearch("")
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className='flex gap-2 items-center w-full'>
                <div className='relative flex-1 group'>
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Search...'
                        className='pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all text-sm'
                    />
                </div>

                <div className="flex gap-1.5">


                    <button
                        type="submit"
                        className='bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95'
                        title="Search"
                    >
                        {loading ?
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            </div>
                            :
                            <FaSearch size={14} />
                        }
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className='bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95'
                            title="Reset"
                        >
                            <IoReload size={14} />
                        </button>
                    )}
                </div>

            </div>
        </form>
    )
}

export default SearchTable

