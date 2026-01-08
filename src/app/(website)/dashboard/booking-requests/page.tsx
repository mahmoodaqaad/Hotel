import { getAllBookingRequests, getBookingRequestsCount } from '@/services/bookingRequests'
import { BookingRequest } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import Table from './Table'
import { SearchProps } from '@/utils/Types'
type BookingRequestWithRelations = BookingRequest & {
    user: { name: string };
    room: { name: string };
};
const BookingRequestPage = async ({ searchParams }: SearchProps) => {

    const params = await searchParams; // لازم await
    const pageNumber = params?.pageNumber || 1;
    const search = params?.search || "";
    const sort = params?.sort || "";
    const order = params?.order || "";
    const filter = params?.filter || "";

    const BookingRequest = await getAllBookingRequests({ pageNumber })

    const count = await getBookingRequestsCount()


    return (
        <section >
            <div className='flex items-center justify-between px-2 '>
                <h1 className='text-4xl font-semibold'>Booking Request</h1>
                <Link href={"/dashboard/booking-requests/addrequest"} className='bg-indigo-700  text-white px-3 py-2 text-xl rounded hover:bg-indigo-500 transition-all  '>add Request</Link>
            </div>
            <Table

                showOtherTable={true}
                requests={BookingRequest}
                pageNumber={(Number(pageNumber))}
                count={count} action={true}
            />

        </section>
    )
}

export default BookingRequestPage
