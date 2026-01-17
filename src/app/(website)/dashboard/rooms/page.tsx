import Link from 'next/link'
import React from 'react'
import { getAllRooms, getRoomsCount } from '@/services/rooms'
import { User } from '@prisma/client'
import Table from './Table'
import { varfiyTokenForPage } from '@/utils/verfiyToken'
import { RoomWithReltion, SearchProps } from '@/utils/Types'

const UserPage = async ({ searchParams }: SearchProps) => {
  const { pageNumber, search = "", sort = "", order = "", filter = "" } = await searchParams

  /*
  const roomsRaw = await getAllRooms({
    pageNumber,
    search,
    sort,
    order: (order === "asc" || order === "desc") ? order : undefined,
    filter
  })
  const rooms = roomsRaw as unknown as RoomWithReltion[]
  */
  // const rooms: RoomWithReltion[] = [];

  let rooms: RoomWithReltion[] = [];
  try {
    const roomsRaw = await getAllRooms({
      pageNumber,
      search,
      sort,
      order: (order === "asc" || order === "desc") ? order : undefined,
      filter
    });
    rooms = roomsRaw as unknown as RoomWithReltion[];
  } catch (error) {
    console.error("DEBUG: getAllRooms failed:", error);
    // Fallback to empty array to allow page render
    rooms = [];
  }

  const count: number = await getRoomsCount()
  const SignUser = await varfiyTokenForPage() as User
  if (!SignUser) return null;

  return (
    <section >
      <div className='flex items-center justify-between px-2 '>
        <h1 className='text-4xl font-semibold'>Rooms</h1>
        {(SignUser?.role === "SuperAdmin" || SignUser?.role === "Admin") &&

          <Link href={"/dashboard/rooms/addroom"} className='bg-indigo-700  text-white px-3 py-2 text-xl rounded hover:bg-indigo-500 transition-all  '>add Room</Link>
        }      </div>
      <Table showOtherTable={true} count={count} rooms={rooms} user={SignUser} pageNumber={Number(pageNumber)} action={true} />

    </section>
  )
}

export default UserPage
