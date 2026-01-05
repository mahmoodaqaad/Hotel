import SearchRoom from '@/components/WebSite/Rooms/SearchRoom/SearchRoom'
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import { DOMAIN } from '@/utils/consant'
import { RoomWithReltionAll } from '@/utils/Types'
import React from 'react'
interface FilterProps {
    searchParams: {
        guest: string
        checkIn: string
        checkOut: string
        type: string
    }

}
const RoomsFilter = async ({ searchParams: { guest, checkIn, checkOut, type } }: FilterProps) => {

    const response = await fetch(`${DOMAIN}/api/rooms/filter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ guest, checkIn, checkOut, type })
    })

    if (response.status === 404) return (
        <main className='min-h-screen bg-slate-50 dark:bg-slate-950 pt-[120px] pb-24'>
            <div className='container mx-auto px-6 text-center'>
                <div className="text-8xl mb-8">🏨</div>
                <h1 className='text-3xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tighter'>
                    No Availability
                </h1>
                <p className='text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-12'>
                    We couldn&apos;t find any rooms matching your specific filters. Try adjusting your dates or room type.
                </p>
                <div className='max-w-xl mx-auto'>
                    <SearchRoom />
                </div>
            </div>
        </main>
    )

    if (!response.ok) throw new Error("Error in fetch data filter")
    const data: RoomWithReltionAll[] = await response.json()

    return (
        <main className='min-h-screen bg-slate-50 dark:bg-slate-950 pt-[120px] pb-24'>
            <div className='container mx-auto px-6'>
                <div className="mb-12">
                    <h1 className='text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 uppercase tracking-tight'>
                        Filtered Results
                    </h1>
                    <div className="flex gap-4 items-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full">{type || 'Any Room'}</span>
                        <span className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-full">{guest} Guests</span>
                    </div>
                </div>

                <div className='mb-16'>
                    <SearchRoom />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {data.map((item) => (
                        <SingleRoom key={item.id} room={item} booking={false} />
                    ))}
                </div>
            </div>
        </main>
    )
}


export default RoomsFilter
