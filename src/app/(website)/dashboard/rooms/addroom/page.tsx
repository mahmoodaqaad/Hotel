import React from 'react'
import AddRoom from './AddRoom'
import { varfiyTokenForPage } from '@/utils/verfiyToken'
import AuthGuardPage from '@/components/Auth/AuthGuard/AuthGuard'
import { User } from '@prisma/client'

const page = async () => {
    const user = await varfiyTokenForPage() as User
    return (
        <AuthGuardPage allowedRole={["SuperAdmin", "Admin"]}>

            <section className='vh-dash flex justify-center items-center'  >
            
                    <AddRoom user={user} />

            </section>
        </AuthGuardPage>
    )
}

export default page
