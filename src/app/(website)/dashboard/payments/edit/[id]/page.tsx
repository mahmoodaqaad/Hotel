

import React from 'react'
import EditForm from './EditForm'
import { Payment, Booking } from '@prisma/client'
import { getSinglePayment } from "@/services/payments"
import { notFound } from 'next/navigation'

interface props {
    params: { id: string }
}
const page = async ({ params }: props) => {
    const { id } = await params;
    const payment = await getSinglePayment(id) as (Payment & { booking: Booking })

    if (!payment) return notFound()

    return (
        <section className='vh-dash flex justify-center items-center'  >
            <div className='w-full'>
                <EditForm payment={payment} />
            </div>

        </section>
    )
}

export default page
