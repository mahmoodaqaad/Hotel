import EditPasswordForm from '@/components/Dashboard/EditPasswordForm/EditPasswordForm'
import React from 'react'

const EditPassword = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>Security</h2>
                <p className="text-slate-500 text-sm font-medium">Update your account password.</p>
            </div>

            <div className='flex-1'>
                <EditPasswordForm showBotton={true} />
            </div>
        </div>
    )
}

export default EditPassword
