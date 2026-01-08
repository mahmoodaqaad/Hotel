"use client"
import React from 'react'
import Form from './Form'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditPasswordForm = ({ showBotton = true }: { showBotton: boolean }) => {
    return (
        <div className='bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-6 border border-slate-100 dark:border-white/5'>
            <Form />
        </div>
    )
}

export default EditPasswordForm
