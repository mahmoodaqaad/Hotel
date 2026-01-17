/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import { varfiyMyAccount } from '@/utils/verfiyToken'
import React from 'react'

const page = async () => {
    const user = await varfiyMyAccount(true) as any;
    if (!user) return null;

    return (
        <div className='pt-[86px] lg:pt-[104px] '>

            <div className='text-3xl font-mono mb-2'>
                My Booking Requests
            </div>

            <div className='grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6'>
                {
                    user?.bookingRequests?.map((item: any, i: number) => (
                        <div key={i} className='p-2'>
                            {item?.room && <SingleRoom booking={false} room={item.room} />}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page
