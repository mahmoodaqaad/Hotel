import React from 'react'

import { getSingleRoom } from '@/services/rooms'
import EditForm from './EditForm'
import AuthGuardPage from '@/components/Auth/AuthGuard/AuthGuard'
interface EditFormProps {
    params: { id: string }
}
const EditRoom = async ({ params }: EditFormProps) => {
    // Await params if needed in improved next.js versions, but currently props.
    // However, getSingleRoom expects id.
    const { id } = await params;
    // Prisma returns Room with images.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Room = await getSingleRoom(id) as any

    return (
        <AuthGuardPage allowedRole={["SuperAdmin", "Admin"]}>

            <section className='vh-dash flex justify-center items-center'  >
                <EditForm room={Room} />
            </section>
        </AuthGuardPage>

    )
}

export default EditRoom
