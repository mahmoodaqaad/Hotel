"use client"
import { LoadingBtn } from '@/app/(website)/dashboard/loading';
import { SocketContext } from '@/Context/SocketContext';
import { DOMAIN } from '@/utils/consant';
import { Notification, User } from '@prisma/client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';


const Notifiction = ({ user }: { user: User & { Notification: Notification[] } }) => {
    const context = useContext(SocketContext)
    if (!context) {

        throw new Error("error in context soket in notficion compoenets")

    }
    const { notifications, setNotification, setMyUser } = context



    const [showNotification, setShowNotification] = useState(false)
    const IsNotReadNumber = (notifications || [])?.filter(item => !item.isRead)
    const router = useRouter()



    useEffect(() => {
        if (user) {
            setMyUser(user)
        }
    }, [setMyUser, user])

    useEffect(() => {
        // Only set initial notifications if we don't have any yet
        // to avoid overwriting newer SWR updates
        if (user?.Notification && notifications.length === 0) {
            setNotification(user.Notification)
        }
    }, [user?.Notification, notifications.length, setNotification])
    console.log(notifications);

    const ReadNotfiction = async (id: string) => {
        try {
            axios.put(`${DOMAIN}/api/notifications/read/${id}`)

            const newnNotif = notifications.map(item => {

                if (id === item.id) {

                    item.isRead = true
                    return item
                }
                return item

            })
            setNotification(newnNotif)


        } catch (error) {
            console.log(error);

        }

    }
    const ReadAllNotfiction = async () => {
        try {
            axios.patch(`${DOMAIN}/api/notifications/read/${user.id}`)

            const newnNotif = notifications.map(item => {


                item.isRead = true
                return item
            })
            setNotification(newnNotif)


        } catch (error) {
            console.log(error);

        }

    }

    return (

        <div className='text-3xl  cursor-pointer  relative'>

            <div onClick={() => {

                setShowNotification(!showNotification)
            }}>
                {
                    notifications?.some(item => !item.isRead) &&
                    <div className='w-6 h-6 rounded-full flex justify-center items-center bg-red-600 text-white text-sm absolute -right-2 -top-2'>
                        {IsNotReadNumber.length}

                    </div>
                }
                <IoMdNotifications className='hover:scale-125 transition-all text-orange-600' />
            </div>
            {
                showNotification &&

                <div className='   bg-white  w-[250px] min-[350px]:w-[350px]  rounded-lg absolute  -right-6  z-50 text-black dark:text-white border   shadow-lg '>
                    <div className=' max-h-[420px] overflow-y-auto scroll-m-8'>

                        <div className='text-3xl font-semibold p-3 bg-red-500 text-white' >Notifiction</div>

                        {notifications.length > 0 ?
                            (notifications || []).map((item, i) => (
                                <div key={i} className={` ${item.isRead ? "bg-gray-50  dark:bg-gray-900  hover:bg-gray-100 " : "bg-sky-100  dark:bg-sky-950 hover:bg-gray-300 "} border-gray-200 border-2 border-t  transition-all p-1 `}

                                    onClick={() => {
                                        if (item?.link) {
                                            <LoadingBtn />
                                            router.push(`${DOMAIN}/${item?.link}`

                                            )
                                        }
                                        if (!item.isRead) {
                                            ReadNotfiction(item.id)
                                        }
                                    }}
                                >

                                    <div className=" text-xl ">{item.message}
                                        <div className='mt-2 text-right text-gray-400 text-sm gap-3 flex items-center justify-end'>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                            {"_"}
                                            {
                                                new Date(item.createdAt).toLocaleTimeString()
                                            }
                                        </div>

                                    </div>
                                </div>
                            ))
                            :
                            <p className='text-center p-2 text-gray-400 dark:text-gray-600 '>No notifications</p>
                        }
                    </div>
                    {
                        notifications?.some(item => !item.isRead) &&
                        <button
                            onClick={() => {
                                notifications?.some(item => !item.isRead)

                                ReadAllNotfiction()

                            }}
                            disabled={!notifications?.some(item => !item.isRead)} className='bg-gray-300 dark:bg-gray-800  text-2xl p-2 text-center transition-all hover:bg-gray-400 disabled:bg-gray-200 dark:disabled:disabled:bg-gray-700 w-full'>
                            Read All
                        </button>
                    }
                </div>
            }
        </div >
    )
}

export default Notifiction
