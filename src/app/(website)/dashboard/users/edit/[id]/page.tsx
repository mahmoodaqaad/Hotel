import React from 'react'
import EditForm from './EditForm'
import { User } from '@prisma/client'
import { getSingleUser } from '@/services/users'
import { notFound } from 'next/navigation'
import AuthGuardPage from '@/components/Auth/AuthGuard/AuthGuard'
interface EditFormProps {
    params: { id: string }
}
const page = async ({ params: { id } }: EditFormProps) => {
    const user = await getSingleUser(id)
    if (!user) notFound()

    return (
        <AuthGuardPage allowedRole={["SuperAdmin", "Admin", "Manager"]}>

            <section className='vh-dash flex justify-center items-center'  >
                <EditForm user={user} ShowRole={true} redirect={true} />

            </section>
        </AuthGuardPage>
    )
}

export default page