import TableShow from '@/components/Dashboard/Table/TableShow'

import { BookingWithRelations, tableProps } from '@/utils/Types'


const Table = ({ Booking, action = true, pageNumber = 1, count, showOtherTable }: {
    Booking: BookingWithRelations[],
} & tableProps) => {









    const head = [
        { key: "id", value: "ID" },
        { key: "user", value: "User name" },
        { key: "room", value: "Room name" },
        { key: "status", value: "Status" },
        { key: "paymentStatus", value: "paymentStatus" },
        { key: "totalAmount", value: "totalAmount" },
        { key: "paidAmount", value: "paidAmount" },
        // { key: "remainingAmount", value: "remainingAmount" },
        { key: "checkIn", value: "checkIn" },
        { key: "checkOut", value: "checkOut" },
        { key: "createdAt", value: "Created At" },
        { key: "Update Status", value: "Update Status" },
        // { key: "Action", value: "Action" },

    ]
    return (
        <div className='overflow-auto'>
            <div className='overflow-auto'>
                <TableShow
                    showOtherTable={showOtherTable}
                    action={action}
                    page={Number(pageNumber)}
                    count={count}
                    path='bookings'
                    one='canceled'
                    tow='completed'
                    three='failed'
                    four='paid'
                    data={Booking} header={head}
                    singleUser={undefined}
                    sortOptions={[
                        { value: "createdAt", label: "Date" },
                        { value: "totalAmount", label: "Amount" },
                        { value: "status", label: "Status" },
                        { value: "checkIn", label: "Check In" },
                        { value: "checkOut", label: "Check Out" }
                    ]}
                    filterOptions={{
                        label: "Status",
                        options: ["active", "completed", "canceled"]
                    }}
                />

            </div>

        </div >

    )
}

export default Table
