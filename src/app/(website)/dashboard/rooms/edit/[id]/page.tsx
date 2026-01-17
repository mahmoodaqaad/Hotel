import React from 'react'

import { getSingleRoom } from '@/services/rooms'
import EditForm from './EditForm'
import AuthGuardPage from '@/components/Auth/AuthGuard/AuthGuard'
interface EditRoomProps {
    params: Promise<{ id: string }>
}
const EditRoom = async ({ params }: EditRoomProps) => {
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
