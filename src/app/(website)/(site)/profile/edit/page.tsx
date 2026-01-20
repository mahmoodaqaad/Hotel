import EditForm from '@/app/(website)/dashboard/users/edit/[id]/EditForm'
import { varfiyMyAccount } from '@/utils/verfiyToken'
import { User } from '@prisma/client'
import React from 'react'

const page = async () => {
    const user = await varfiyMyAccount() as User
    if (!user) return null;

    return (
        <div className='pt-[86px] lg:pt-[104px] '>



            <EditForm user={user} ShowRole={false} redirect={false} />
        </div>
    )
}

export default page
