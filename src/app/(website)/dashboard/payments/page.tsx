
// import Link from 'next/link'
import React from 'react'
import Table from './Table'
import { getAllPayments, getPaymentsCount } from '@/services/payments'
import { SearchProps } from '@/utils/Types'

const PaymentsPage = async ({ searchParams }: SearchProps) => {
  const { pageNumber, search = "" } = await searchParams
  const payments = await getAllPayments({ pageNumber, search })
  const count = await getPaymentsCount()

  return (
    <section >
      <div className='flex items-center justify-between px-2 '>
        <h1 className='text-4xl font-semibold'>Payments</h1>
        {/* <Link href={"/dashboard/payments/addpayment"} className='bg-indigo-700  text-white px-3 py-2 text-xl rounded hover:bg-indigo-500 transition-all  '>add Payment</Link> */}
      </div>
      <Table showOtherTable={true} action={true} payments={payments} count={count} pageNumber={Number(pageNumber)} />

    </section>
  )
}

export default PaymentsPage
