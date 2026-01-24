"use client"

import { User } from '@prisma/client'
import React, { useContext, useTransition, useCallback, useState, useEffect } from 'react'
import UnData from '../../../utils/Tools/UnData'
import PaginationPage from '../../../utils/pagination/Pagination'
import { DOMAIN } from '@/utils/consant'
import { ModeContext } from '@/Context/ModeContext'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import SearchTable from './SearchTable'
import { SocketContext } from '@/Context/SocketContext'
import TableRow from './TableRow'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterOption {
    label: string;
    options: string[];
}

interface SortOption {
    value: string;
    label: string;
}

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    singleUser: User | undefined
    action: boolean
    header: { key: string; value: string }[];
    one: string,
    tow: string
    path: string
    three: string,
    four: string
    count: number
    showOtherTable: boolean
    page: number
    filterOptions?: FilterOption;
    sortOptions?: SortOption[];
}

const TableShow = (props: Props) => {
    const { data, singleUser, action, header, one, tow, three = "", four = "", path, page, count, showOtherTable = false, filterOptions, sortOptions } = props
    const [isPending, startTransition] = useTransition()

    const contextSocket = useContext(SocketContext)
    const onlineUser = contextSocket?.onlineUsers || []

    const contextMode = useContext(ModeContext)
    if (!contextMode) {
        throw new Error("Error in mode context")
    }
    const { isDarkmode } = contextMode
    const router = useRouter()

    const handleUpdateStatus = useCallback(async (id: number, comf: boolean) => {
        const Swal = (await import('sweetalert2')).default
        try {
            if (comf) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You want to accept this request!",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#ef4444",
                    confirmButtonText: "Yes, accept!",
                    background: isDarkmode ? "#1e293b" : "#fff",
                    color: isDarkmode ? "#f8fafc" : "#333",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await axios.put(`${DOMAIN}/api/${path}/status/${id}`)
                        router.refresh()
                        Swal.fire({
                            title: "Accepted!",
                            icon: "success",
                            background: isDarkmode ? "#1e293b" : "#fff",
                            color: isDarkmode ? "#f8fafc" : "#333",
                        });
                        toast.success("Request accepted successfully")
                    }
                })
            } else {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#ef4444",
                    confirmButtonText: "Yes, cancel it!",
                    background: isDarkmode ? "#1e293b" : "#fff",
                    color: isDarkmode ? "#f8fafc" : "#333",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.delete(`${DOMAIN}/api/${path}/status/${id}`)
                            router.refresh()
                            Swal.fire({
                                title: "Cancelled!",
                                text: "The request has been cancelled.",
                                icon: "success",
                                background: isDarkmode ? "#1e293b" : "#fff",
                                color: isDarkmode ? "#f8fafc" : "#333",
                            });
                        } catch (error: unknown) {
                            if (axios.isAxiosError(error)) {
                                toast.error(error.response?.data?.message || "Failed to cancel request")
                            } else {
                                toast.error("An unexpected error occurred")
                            }
                        }
                    }
                });
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong")
            } else {
                toast.error("An unexpected error occurred")
            }
        }
    }, [isDarkmode, path, router])

    const handleDelete = useCallback(async (id: number) => {
        const Swal = (await import('sweetalert2')).default
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            background: isDarkmode ? "#1e293b" : "#fff",
            color: isDarkmode ? "#f8fafc" : "#333",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DOMAIN}/api/${path}/${id}`)
                router.refresh()
                Swal.fire({
                    title: "Deleted!",
                    text: "Item has been removed.",
                    icon: "success",
                    background: isDarkmode ? "#1e293b" : "#fff",
                    color: isDarkmode ? "#f8fafc" : "#333",
                });
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Failed to delete")
                } else {
                    toast.error("An unexpected error occurred")
                }
            }
        }
    }, [isDarkmode, path, router])

    const UpdateStatus = useCallback((data: { id: number, status: string, paidAmount: string, totalAmount: string }) => {
        const access = data.status === "active" || data.status === "pending"
        return access ? (
            <div className='flex gap-2 items-center justify-center'>
                {data.totalAmount === data.paidAmount && (
                    <button
                        className='text-xs font-medium px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white rounded-md transition-all'
                        onClick={() => handleUpdateStatus(data?.id, true)}>
                        Complete
                    </button>
                )}
                <button
                    onClick={() => handleUpdateStatus(data?.id, false)}
                    className='text-xs font-medium px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-md transition-all'>
                    Cancel
                </button>
            </div>
        ) : (
            <span className='inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
                No Action
            </span>
        )
    }, [handleUpdateStatus])

    const searchParams = useSearchParams();
    const [filter, setFilter] = useState(searchParams.get("filter") || "")

    useEffect(() => {
        setFilter(searchParams.get("filter") || "")
    }, [searchParams])

    const handleSort = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        startTransition(() => {
            router.push(`/dashboard/${path}?${params.toString()}`);
        })
    }

    return (
        <div className="space-y-6">
            {showOtherTable && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='glass p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between'
                >
                    <div className='w-full lg:w-1/3'>
                        <SearchTable path={path} />
                    </div>

                    <div className='flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end'>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <select
                                onChange={(e) => handleSort("sort", e.target.value)}
                                disabled={isPending}
                                defaultValue={searchParams.get("sort") || ""}
                                className='bg-transparent text-sm p-1.5 outline-none font-medium cursor-pointer disabled:opacity-50'
                            >
                                {sortOptions?.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                )) || (
                                        <>
                                            <option value="createdAt">Sort by Date</option>
                                        </>
                                    )}
                            </select>
                            <select
                                onChange={(e) => handleSort("order", e.target.value)}
                                disabled={isPending}
                                defaultValue={searchParams.get("order") || "desc"}
                                className='bg-transparent text-sm p-1.5 outline-none font-medium cursor-pointer disabled:opacity-50 border-l border-slate-200 dark:border-slate-700 ml-1 pl-2'
                            >
                                <option value="asc">Asc</option>
                                <option value="desc">Desc</option>
                            </select>
                        </div>

                        {filterOptions && (
                            <div className='flex gap-2 items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg'>
                                <select
                                    onChange={(e) => setFilter(e.target.value)}
                                    value={filter}
                                    disabled={isPending}
                                    className='bg-transparent text-sm p-1.5 outline-none font-medium cursor-pointer disabled:opacity-50 min-w-[120px]'
                                >
                                    <option value="">All {filterOptions.label}s</option>
                                    {filterOptions.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleSort("filter", filter)}
                                    disabled={isPending}
                                    className='px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50'
                                >
                                    {isPending ? "..." : "Filter"}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            <div className={`premium-card overflow-hidden ${isPending ? 'opacity-60 grayscale-[0.5]' : ''} transition-all duration-500`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                                <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-500'>#</th>
                                {header.map((th, i) => (
                                    <th key={i} className='p-4 text-xs font-bold uppercase tracking-wider text-slate-500'>{th.value}</th>
                                ))}
                                {((path !== "users") || (singleUser?.role === "SuperAdmin" || singleUser?.role === "Admin")) && action && (
                                    <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center'>Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.length > 0 ? (
                                <AnimatePresence mode='popLayout'>
                                    {data.map((item, i) => (
                                        <TableRow
                                            key={item.id || i}
                                            index={i}
                                            page={page}
                                            data={item}
                                            header={header}
                                            path={path}
                                            singleUser={singleUser}
                                            isMy={item?.id === singleUser?.id}
                                            showEditAndDelete={((path !== "users") || (singleUser?.role === "SuperAdmin" || singleUser?.role === "Admin"))}
                                            action={action}
                                            onlineUser={onlineUser}
                                            one={one}
                                            tow={tow}
                                            three={three}
                                            four={four}
                                            handleDelete={handleDelete}
                                            UpdateStatus={UpdateStatus}
                                        />
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <tr>
                                    <td colSpan={header.length + 2} className="p-0">
                                        <UnData />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {(showOtherTable && !isNaN(page)) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex justify-center mt-8'
                >
                    <PaginationPage path={path} total={count} page={page} />
                </motion.div>
            )}
        </div>
    )
}

export default TableShow
