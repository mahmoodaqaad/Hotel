"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BiEdit } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { Status } from '@/utils/Status'
import { ARTICLE_PER_PAGE } from '@/utils/consant'
import { User } from '@prisma/client'

interface TableRowProps {
    index: number
    page: number
    data: any
    header: { key: string; value: string }[]
    path: string
    singleUser: User | undefined
    isMy: boolean
    showEditAndDelete: boolean
    action: boolean
    onlineUser: any[]
    one: string
    tow: string
    three: string
    four: string
    handleDelete: (id: number) => void
    UpdateStatus: (data: any) => React.ReactNode
}

const TableRow = memo(({
    index,
    page,
    data,
    header,
    path,
    singleUser,
    isMy,
    showEditAndDelete,
    action,
    onlineUser, // Expecting Set<string> now, or convert in component if Set serialization is issue. 
    // Wait, onlineUser passed from TableShow is array. Let's accept array but optimize locally or in parent.
    // Better: Helper function or parent conversion. Let's keep it simple for now but use sizes.
    one,
    tow,
    three,
    four,
    handleDelete,
    UpdateStatus
}: TableRowProps) => {

    const showImages = (images: any[]) => {
        return images.map((img: any) => (
            <div className='relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm group' key={img.id}>
                <Image src={img?.imageUrl || '/placeholder.jpg'}
                    fill
                    sizes="40px"
                    className="object-cover transition-transform group-hover:scale-110"
                    alt=''
                    loading="lazy"
                />
            </div>
        ))
    }

    // Optimize online check if array is large? For < 50 users it's negligible.
    // Focus on Image optimization.

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-border last:border-0 group">
            <td className='p-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
                {page ? ((page - 1) * ARTICLE_PER_PAGE + 1 + index) : index + 1}
            </td>

            {header.map((head, i) => {
                const andYou = isMy && path === "users" && head.key === "name"
                return (
                    <td key={i} className='p-4 text-sm text-slate-700 dark:text-slate-300'>
                        {head.key === "images" ? (
                            <div className='flex -space-x-2 overflow-hidden truncate'>
                                {Array.isArray(data[head.key]) && showImages(data[head.key])}
                            </div>
                        ) : head.key === "price" || head.key === "totalAmount" || head.key === "paidAmount" || head.key === "remainingAmount" ? (
                            <span className="font-semibold text-slate-900 dark:text-white">${data[head.key]}</span>
                        ) : head.key === "user" ? (
                            <span className="font-medium">{data[head.key]?.name || 'N/A'}</span>
                        ) : head.key === "room" ? (
                            <span className="font-medium">{data[head.key]?.name || 'N/A'}</span>
                        ) : head.key === "email" ? (
                            <div className='flex items-center gap-2'>
                                <span className="truncate max-w-[150px]">{data[head.key]}</span>
                                {Array.isArray(onlineUser) && onlineUser.some(u => u.id === data.id) && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                )}
                            </div>
                        ) : (head.value === "Total booked" && head.key === "booking") ? (
                            data[head.key]?.totalAmount || 0
                        ) : head.key === "booking" ? (
                            data[head.key]?.room?.name || 'N/A'
                        ) : head.key === "Update Status" ? (
                            UpdateStatus(data)
                        ) : head.key === "status" ? (
                            Status(data[head?.key], one, tow)
                        ) : head.key === "paymentStatus" ? (
                            Status(data[head?.key], three, four)
                        ) : head.key === "createdAt" || head.key === "checkIn" || head.key === "checkOut" ? (
                            <span className="text-slate-500">{new Date(data[head?.key]).toLocaleDateString()}</span>
                        ) : andYou ? (
                            <span className="font-bold text-blue-600 dark:text-blue-400">{data[head.key]} (You)</span>
                        ) : (
                            <span className="truncate max-w-[200px] block">{data[head.key]}</span>
                        )}
                    </td>
                )
            })}

            {showEditAndDelete && action && (
                <td className='p-4 whitespace-nowrap'>
                    <div className='flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity'>
                        {(path !== "bookings" && path !== "booking-requests") && (
                            <Link
                                href={`/dashboard/${path}/edit/${data?.id}`}
                                className='p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm'
                                title="Edit"
                            >
                                <BiEdit size={18} />
                            </Link>
                        )}
                        {(path !== "users" || (path === "users" && data.id !== singleUser?.id)) && (
                            <button
                                onClick={() => handleDelete(data.id)}
                                className='p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm'
                                title="Delete"
                            >
                                <FaTrash size={16} />
                            </button>
                        )}
                    </div>
                </td>
            )}
        </tr>
    )
})

TableRow.displayName = "TableRow"

export default TableRow
