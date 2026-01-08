/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import { varfiyMyAccount } from '@/utils/verfiyToken'
import React from 'react'

const page = async () => {
    const user = await varfiyMyAccount(true) as any

    return (
        <div className='pt-[86px] lg:pt-[104px] '>

            <div className='text-3xl font-mono mb-2'>
                My Booking
            </div>

            <div className='flex flex-wrap '>
                {
                    user?.bookings?.map((item: any, i: number) => (
                        <div key={i} className='w-full sm:w-1/2 xl:w-1/3 p-2 sm:p-4'>
                            <div className='bg-gray-200 dark:bg-gray-800 shadow-xl   rounded-lg '>

                                <h1 className=' p-2 flex gap-3 items-center'>
                                    <p>Check Out :</p>
                                    <p className='text-2xl font-semibold'>

                                        {new Date(item.checkOut).toDateString()}
                                    </p>
                                </h1>
                                <SingleRoom booking={false} room={item.room} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page
