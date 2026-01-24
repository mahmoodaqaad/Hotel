"use client"
import TableShow from '@/components/Dashboard/Table/TableShow'
import { tableProps } from '@/utils/Types'
import { Booking, Payment, User } from '@prisma/client'


type PaymentProps = Payment & {
    user: User
    booking: Booking & {
        room: {
            name: string
        }
    }
}
const Table = ({ payments, action = true, count, pageNumber, showOtherTable }: { payments: PaymentProps[], } & tableProps) => {

    const head = [
        { key: "id", value: "ID" },
        { key: "user", value: "User name" },
        { key: "booking", value: "Room name" },
        { key: "amount", value: "amount" },
        { key: "booking", value: "Total booked", },
        { key: "status", value: "Status" },
        { key: "method", value: "Method" },
        { key: "createdAt", value: "Created At" },

    ]
    return (
        <div className='overflow-auto'>
            <TableShow
                showOtherTable={showOtherTable}
                action={action}
                one='failed'
                tow='paid'
                path='payments'
                data={payments}
                header={head}
                singleUser={undefined}
                three={''}
                four={''}
                count={count}
                page={pageNumber}
                sortOptions={[
                    { value: "createdAt", label: "Date" },
                    { value: "amount", label: "Amount" },
                    { value: "status", label: "Status" }
                ]}
                filterOptions={{
                    label: "Status",
                    options: ["paid", "failed", "pending"]
                }}
            />


        </div >

    )
}

export default Table
