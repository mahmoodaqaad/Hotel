"use client"

import { DOMAIN } from '@/utils/consant'
import { Room, Saved, User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiBookmark, BiSolidBookmark } from 'react-icons/bi'
import { toast } from 'react-toastify'

const SavePage = ({ user, room }: { room: Room, user: User & { Saved: Saved[] } }) => {
    const [itsave, setItSave] = useState(user?.Saved?.some(item => item.roomId == room.id && item.userId == user.id))
    const router = useRouter()
    const handleSaved = async () => {

        try {
            if (!user) {
                toast.error("You Are Not log in ,must be log in")
                router.replace("/login")
            }
            else {


                axios.post(`${DOMAIN}/api/users/save`, { roomId: room.id, userId: user.id })
                toast.success(itsave ? "Unsaved" : "Saved")

                setItSave(!itsave)
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error);

        }
    }

    return (
        <div className='w-fit ml-auto'>

            <div
                onClick={handleSaved}
                className='bg-blue-500 text-white p-3 rounded-lg text-3xl cursor-pointer hover:bg-blue-200 transition-all'>
                {
                    itsave ?
                        <BiSolidBookmark />
                        :
                        <BiBookmark />
                }
            </div>
        </div>
    )
}

export default SavePage
