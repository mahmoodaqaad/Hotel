"use client"
import TableShow from '@/components/Dashboard/Table/TableShow'
import { RoomWithReltion, tableProps } from '@/utils/Types'
import { User } from '@prisma/client'


const Table = ({ rooms, user, action = true, pageNumber = 1, count, showOtherTable }: { rooms: RoomWithReltion[], user: User, } & tableProps) => {



    const head = [
        { key: "id", value: "ID" },
        { key: "name", value: "name" },
        { key: "price", value: "Price" },
        { key: "roomType", value: "roomType" },
        { key: "guest", value: "guest" },
        { key: "status", value: "Status" },
        { key: "images", value: "Images" },
        { key: "createdAt", value: "Created At" },
        // { key: "Action", value: "Action" },

    ]


    return (
        <div className='overflow-auto'>
            <TableShow action={action}
                showOtherTable={showOtherTable}
                path={'rooms'}
                page={pageNumber}
                count={count}
                one='booked'
                tow='available'
                data={rooms} header={head} singleUser={user}
                three={''} four={''}

            />

        </div>

    )
}

export default Table
