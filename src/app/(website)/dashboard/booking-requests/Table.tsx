"use client"
import TableShow from '@/components/Dashboard/Table/TableShow'
import { BookingRequestWithRelations, tableProps } from '@/utils/Types'


const Table = ({ requests, action = true, pageNumber = 1, count, showOtherTable }: { requests: BookingRequestWithRelations[] } & tableProps) => {



    const head = [
        { key: "id", value: "ID" },
        { key: "user", value: "User name" },
        { key: "room", value: "Room name" },
        { key: "status", value: "Status" },

        { key: "checkIn", value: "checkIn" },
        { key: "checkOut", value: "checkOut" },
        { key: "createdAt", value: "Created At" },
        { key: "Update Status", value: "Update Status" },

    ]

    return (
        <div className='overflow-auto'>
            <TableShow action={action}
                showOtherTable={showOtherTable}
                count={count}
                page={pageNumber}
                one='rejected'
                tow='approved'
                path='booking-requests'


                data={requests} header={head} singleUser={undefined} three={''} four={''}
                sortOptions={[
                    { value: "createdAt", label: "Date" },
                    { value: "status", label: "Status" },
                    { value: "checkIn", label: "Check In" }
                ]}
                filterOptions={{
                    label: "Status",
                    options: ["pending", "approved", "rejected"]
                }}
            />

        </div >

    )
}

export default Table
