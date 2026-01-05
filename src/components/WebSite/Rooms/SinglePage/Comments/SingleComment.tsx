"use client"

import { DOMAIN } from '@/utils/consant'
import { CommentWithUser } from '@/utils/Types'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiTrash, HiUser, HiClock } from 'react-icons/hi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const SingleComment = ({ item, user }: { item: CommentWithUser, user: User }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Check if current user can delete this comment
    const canDelete = user && (user.id === item.userId || user.role === "Admin" || user.role === "SuperAdmin")

    const handleDeleteComment = async () => {
        const result = await Swal.fire({
            title: "Delete Comment?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it",
            customClass: {
                popup: 'rounded-[1.5rem] dark:bg-slate-900 dark:text-white',
                title: 'font-bold tracking-tight'
            }
        })

        if (result.isConfirmed) {
            try {
                setLoading(true)
                await axios.delete(`${DOMAIN}/api/comments/${item.id}`)
                toast.success("Comment deleted successfully")
                router.refresh()
            } catch (error: any) {
                console.error(error)
                toast.error(error.response?.data?.message || "Failed to delete comment")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white dark:bg-slate-800/30 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 ring-1 ring-black/5 dark:ring-black/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300"
        >
            <div className="flex items-start gap-4">
                {/* User Avatar Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400">
                    <HiUser size={24} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">
                            {item.user.name}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                            <HiClock size={12} />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                        {item.text}
                    </p>
                </div>

                {canDelete && (
                    <div className="md:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDeleteComment}
                            disabled={loading}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                                <HiTrash size={20} />
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default SingleComment
