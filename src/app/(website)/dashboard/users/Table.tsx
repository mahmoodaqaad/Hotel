"use client"
import TableShow from '@/components/Dashboard/Table/TableShow'
import { tableProps } from '@/utils/Types'
import { User } from '@prisma/client'

const Table = ({ users, SignUser, action = true, count, pageNumber, showOtherTable }: { users: User[], SignUser: User, } & tableProps) => {


    const head = [
        { key: "id", value: "ID" },
        { key: "name", value: "name" },
        { key: "email", value: "Email" },
        { key: "role", value: "Role" },
        { key: "createdAt", value: "Created At" },
        // { key: "Action", value: "Action" },

    ]
    return (

        <div className='overflow-auto'>
            <TableShow action={action}
                showOtherTable={showOtherTable}
                count={count}
                page={pageNumber}
                path="users"
                one='booked'
                tow='available'
                three={''}
                four={''}
                data={users} header={head} singleUser={SignUser}
                sortOptions={[
                    { value: "createdAt", label: "Date" },
                    { value: "role", label: "Role" },
                    { value: "name", label: "Name" },
                    { value: "email", label: "Email" }
                ]}
                filterOptions={{
                    label: "Role",
                    options: ["SuperAdmin", "Admin", "Manager", "User"]
                }}
            />


        </div>

    )
}

export default Table
