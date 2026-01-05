import { getRoomsBySearch } from '@/apiCall/Rooms'
import SearchRoom from '@/components/WebSite/Rooms/SearchRoom/SearchRoom'
import SingleRoom from '@/components/WebSite/Rooms/SingleRoom/SingleRoom'
import { RoomWithReltionAll } from '@/utils/Types'
import React from 'react'


const SearchPage = async ({ searchParams: { search } }: { searchParams: { search: string } }) => {
    const rooms: RoomWithReltionAll[] = await getRoomsBySearch(search)

    return (
        <main className='min-h-screen bg-slate-50 dark:bg-slate-950 pt-[120px] pb-24'>
            <div className='container mx-auto px-6'>
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                        Search Results
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} found for "{search}"
                    </p>
                </div>

                <div className="mb-16">
                    <SearchRoom />
                </div>

                {rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {rooms.map((room) => (
                            <SingleRoom key={room.id} booking={true} room={room} />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-24 text-center'>
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className='text-2xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4'>
                            No Experiences Found
                        </h2>
                        <p className='text-slate-500 dark:text-slate-400 max-w-md mx-auto'>
                            We couldn&apos;t find any rooms matching your search. Try different keywords or browse our full collection.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

export default SearchPage

