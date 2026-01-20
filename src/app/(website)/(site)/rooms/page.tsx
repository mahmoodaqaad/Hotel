import { getRoomsCount } from '@/services/rooms'
import Header from '@/components/WebSite/header/Header'
import Rooms from '@/components/WebSite/Rooms/Rooms'
import React from 'react'


const RoomsPage = async () => {
    const count = await getRoomsCount()
    return (
        <div className='pt-[86px] lg:pt-[104px] dark:bg-gray-700'>
            <Header />

            <Rooms count={count} />
        </div>
    )
}

export default RoomsPage
