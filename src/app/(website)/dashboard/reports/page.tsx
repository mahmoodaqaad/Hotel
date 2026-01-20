"client "

import { getAllBookings } from '@/services/bookings'
import { getAllBookingRequests } from '@/services/bookingRequests'
import { getAllRooms } from '@/services/rooms'
import { getAllUsers } from '@/services/users'
import React from 'react'
import { FaBed, FaClipboardList, FaUsers } from 'react-icons/fa'
import { MdOutlineEventAvailable } from 'react-icons/md'
import TopChannel from '@/components/Dashboard/TopCannel/TopChannel'
import Tables from '@/components/Dashboard/Report/Tables'
import { varfiyTokenForPage } from '@/utils/verfiyToken'
import { BookingRequestWithRelations, BookingtWithRelations, RoomWithReltion } from '@/utils/Types'
import { User } from '@prisma/client'
import DownloadReqort from '@/components/Dashboard/Report/DownloadReqort'
import ReportChart from '@/components/Dashboard/Report/ReportChart/ReportChart'
import Card from '@/components/Dashboard/Report/Card'



const page = async () => {

  const Users = await getAllUsers({ pageNumber: 1 }) as User[]
  const Room = await getAllRooms({ pageNumber: 1 }) as RoomWithReltion[]
  const Booking = await getAllBookings({ pageNumber: 1 }) as unknown as BookingtWithRelations[]
  const BookingRequest = await getAllBookingRequests({ pageNumber: 1 }) as BookingRequestWithRelations[]
  const singleUser = await varfiyTokenForPage() as User
  if (!singleUser) return null;


  const data = [
    { link: "users", color: "blue", Icon: FaUsers, title: "Users", length: Users.length },
    { link: "rooms", color: "yellow", Icon: FaBed, title: "Rooms", length: Room.length },
    { link: "bookings", color: "green", Icon: MdOutlineEventAvailable, title: "Bookings", length: Booking.length },
    { link: "booking-requests", color: "red", Icon: FaClipboardList, title: "Booking Requests", length: BookingRequest.length },
  ];
  return (
    <section>
      <div className='flex items-center justify-between px-2 '>

        <h1 className='text-4xl font-semibold'>Reports</h1>
        <DownloadReqort
          Users={Users}
          Room={Room}
          Booking={Booking}
          BookingRequest={BookingRequest}
        />
      </div>

      <div className='flex flex-wrap items-center justify-between mt-4'>
        {data.map((item, index) => (
          <Card key={index} {...item} />
        ))}








      </div>
      <TopChannel />


      <div className='mt-5'>

        <Tables
          singleUser={singleUser}
          Users={Users}
          Room={Room}
          Booking={Booking}
          BookingRequest={BookingRequest}
        />
      </div>

      <ReportChart
        users={Users}
        rooms={Room}
        bookings={Booking}
        bookingRequests={BookingRequest}
      />
    </section>
  )
}

export default page
