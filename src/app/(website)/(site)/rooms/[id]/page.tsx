import { getSingleRoom } from '@/services/rooms'
import React from 'react'
import ShowDetalits from './ShowDetalits'
import CommentAndReting from './CommentAndReting'
import { varfiyMyAccount } from '@/utils/verfiyToken'
import { User } from '@prisma/client'
import { notFound } from 'next/navigation'
import { RoomWithReltionAll } from '@/utils/Types'

interface SingleArticlesPageProps {
    params: Promise<{ id: string }>
}

const RoomPage = async ({ params }: SingleArticlesPageProps) => {
    const { id } = await params;
    const [roomData, user] = await Promise.all([
        getSingleRoom(id),
        varfiyMyAccount() as Promise<User>
    ])

    if (!roomData) return notFound();

    // Cast to expected type as service returns inferred type compatible with structure
    const room = roomData as unknown as RoomWithReltionAll;

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-[120px]">
            <div className="container mx-auto px-4 md:px-6">
                {/* Hero-like spacing for room details */}
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-white/5">
                    <ShowDetalits room={room} user={user} />
                </div>

                <div className="mt-20 border-t border-slate-100 dark:border-white/5 pt-20 pb-40">
                    <CommentAndReting room={room} user={user} />
                </div>
            </div>
        </main>
    )
}

export default RoomPage
