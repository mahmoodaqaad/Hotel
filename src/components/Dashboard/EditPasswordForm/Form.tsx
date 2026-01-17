import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import React, { FormEvent, SetStateAction, useState } from 'react'
import { HiLockClosed, HiKey } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { LoadingBtn } from '@/app/loading'


const Form = ({ setShowMore }: { setShowMore?: React.Dispatch<SetStateAction<boolean>> }) => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword1, setNewPassword1] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [loading, setLoading] = useState(false)

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if (!oldPassword) return toast.error("Current password is required")
            if (!newPassword1) return toast.error("New password is required")
            if (!newPassword2) return toast.error("Confirm new password is required")
            if (oldPassword.length < 6) return toast.error("Password must be at least 6 characters")
            if (newPassword1.length < 6) return toast.error("New password must be at least 6 characters")
            if (newPassword1 !== newPassword2) return toast.error("New passwords do not match")
            if (oldPassword === newPassword1) return toast.error("New password cannot be the same as old password")

            setLoading(true)
            await axios.put(`${DOMAIN}/api/users/password`, {
                old: oldPassword,
                new: newPassword1
            })
            toast.success("Password Updated Successfully")
            setOldPassword("")
            setNewPassword1("")
            setNewPassword2("")
            if (setShowMore) setShowMore(false)
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to update password");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleEdit} className='space-y-5'>
            <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <HiLockClosed size={20} />
                </div>
                <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                />
            </div>

            <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <HiKey size={20} />
                </div>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newPassword1}
                    onChange={e => setNewPassword1(e.target.value)}
                />
            </div>

            <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <HiKey size={20} />
                </div>
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newPassword2}
                    onChange={e => setNewPassword2(e.target.value)}
                />
            </div>

            <button
                disabled={loading}
                type='submit'
                className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 disabled:bg-slate-400 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {loading ? <LoadingBtn /> : "Update Password"}
            </button>
        </form>
    )
}

export default Form
