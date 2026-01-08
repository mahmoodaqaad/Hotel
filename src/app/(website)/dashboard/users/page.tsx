import { getAllUsers, getUsersCount } from '@/services/users'
import { User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import Table from './Table'
import { varfiyTokenForPage } from '@/utils/verfiyToken'
import { SearchProps } from '@/utils/Types'

const UserPage = async ({ searchParams }: SearchProps) => {
  const { pageNumber, search = "", sort = "", order = "", filter = "" } = await searchParams
  const users = await getAllUsers({ pageNumber, search, sort, order, filter })
  const count = await getUsersCount()
  const SignUser = await varfiyTokenForPage() as User

  return (

    <section >
      <div className='flex items-center justify-between px-2 '>
        <h1 className='text-4xl font-semibold'>Users</h1>
        {(SignUser?.role === "SuperAdmin" || SignUser?.role === "Admin") &&

          <Link href={"/dashboard/users/adduser"} className='bg-indigo-700  text-white px-3 py-2 text-xl rounded hover:bg-indigo-500 transition-all  '>add user</Link>
        }
      </div>
      <Table showOtherTable={true} users={users} SignUser={SignUser} action={true} count={count} pageNumber={Number(pageNumber)} />

    </section>
  )
}

export default UserPage
