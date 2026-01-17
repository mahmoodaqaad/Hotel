/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import { varfiyMyAccount } from '@/utils/verfiyToken'
import React from 'react'

const page = async () => {
    const user = await varfiyMyAccount(true) as any
    if (!user) return null;

    return (
        <div className='pt-[86px] lg:pt-[104px] '>

            <div className='text-3xl font-mono mb-2'>
                My Booking
            </div>

            <div className='grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6'>
                {
                    user?.bookings?.map((item: any, i: number) => (
                        <div key={i} className='bg-gray-200 dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden'>
                            <h1 className='p-4 flex gap-3 items-center border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50'>
                                <p className='text-sm text-gray-500 uppercase font-bold tracking-wider'>Check Out:</p>
                                <p className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                                    {new Date(item.checkOut).toLocaleDateString()}
                                </p>
                            </h1>
                            <div className='p-2'>
                                {item?.room && <SingleRoom booking={false} room={item.room} />}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page
