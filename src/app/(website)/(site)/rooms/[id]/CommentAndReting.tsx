"use client"

import CreateComment from '@/components/WebSite/Rooms/SinglePage/Comments/CreateComment'
import Rating from '@/components/WebSite/Rooms/SinglePage/Comments/Rating/Rating'
import ShowAllcomment from '@/components/WebSite/Rooms/SinglePage/Comments/ShowAllcomment'
import { CommentWithUser, RoomWithReltionAll } from '@/utils/Types'
import { User } from '@prisma/client'
import React from 'react'
import { HiChatAlt2, HiStar, HiLockClosed } from 'react-icons/hi'

const CommentAndReting = ({ room, user }: { room: RoomWithReltionAll, user: User }) => {
    const userHasRated = room?.Rating.some(item => item.userId === user?.id)

    return (
        <section className="max-w-4xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-10">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Guest Reviews
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Hear from travelers who stayed here
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-500/10 px-6 py-4 rounded-3xl border border-blue-100 dark:border-blue-500/20">
                    <div className="flex text-yellow-500">
                        <HiStar size={24} />
                    </div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {room?.averageRating?.toFixed(1)} / 5
                    </div>
                    <div className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">
                        Average
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left side: Rating and New Comment */}
                <div className="lg:col-span-12 space-y-10">
                    {!user ? (
                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 text-center">
                            <HiLockClosed className="mx-auto text-4xl text-slate-400 mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">Sign in to share your experience</p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm">Your feedback helps others make better choices.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <HiStar className="text-yellow-500" />
                                    {userHasRated ? "Your Rating" : "Rate Your Stay"}
                                </h3>
                                {userHasRated ? (
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold py-4 px-6 rounded-2xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20 animate-in fade-in slide-in-from-top-4">
                                        Thank you for rating this room!
                                    </div>
                                ) : (
                                    <Rating room={room} user={user} />
                                )}
                            </div>

                            <div className="pt-10 border-t border-slate-200 dark:border-white/10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <HiChatAlt2 className="text-blue-500" />
                                    Share Your Thoughts
                                </h3>
                                <CreateComment roomId={room?.id} userId={user?.id} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Comment Feed */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Comments</h3>
                        <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            {room?.comments?.length || 0} Entries
                        </span>
                    </div>
                    <ShowAllcomment comments={room?.comments as CommentWithUser[]} user={user} />
                </div>
            </div>
        </section>
    )
}

export default CommentAndReting
