import { getFilteredRooms } from '@/services/rooms'
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import SearchRoom from '@/components/WebSite/Rooms/SearchRoom/SearchRoom'
import React from 'react'

interface FilterProps {
    searchParams: Promise<{
        guest: string
        checkIn: string
        checkOut: string
        type: string
    }>

}
const RoomsFilter = async ({ searchParams }: FilterProps) => {
    // Await searchParams as per Next.js recent versions best practices (though params is the prop here)
    const { guest, checkIn, checkOut, type } = await searchParams;

    const data = await getFilteredRooms({ guest, checkIn, checkOut, type });

    if (!data || data.length === 0) return (
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

    // Ensure data matches what SingleRoom expects. 
    // getFilteredRooms returns Room & { images: RoomImage[] }. 
    // SingleRoom usually expects this. casting if necessary or letting TS infer.

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
