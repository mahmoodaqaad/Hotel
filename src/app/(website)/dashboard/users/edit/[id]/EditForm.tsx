"use client"
import { DOMAIN } from '@/utils/consant'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { HiUser, HiMail, HiShieldCheck, HiPencilAlt, HiSave } from 'react-icons/hi'
import { LoadingPage } from '@/app/loading'

const EditForm = ({ user, ShowRole = true, redirect = true }: { user: User, ShowRole: boolean, redirect: boolean }) => {
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [role, setRole] = useState(user?.role as string)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const EditUser = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)

            if (!name) return toast.error("Name is required");
            if (name.length < 2) return toast.error("Name must be at least 2 characters");

            if (!email) return toast.error("Email is required");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Invalid email address");

            if (ShowRole && !role) return toast.error("Role is required");

            await axios.put(`${DOMAIN}/api/users/${user.id}`, { name, email, role })

            toast.success("User updated successfully")

            if (redirect) {
                router.push("/dashboard/users?pageNumber=1")
                router.refresh()
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            console.log(e);
            toast.error(e?.response?.data?.message || "Failed to update user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {loading && <LoadingPage />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6 md:p-12 mb-8"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <HiPencilAlt size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit User</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Update account information and permissions</p>
                </div>

                <form onSubmit={EditUser} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiUser className="text-blue-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                placeholder='Full Name'
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiMail className="text-blue-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder='Email Address'
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {ShowRole && (
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiShieldCheck className="text-blue-500" /> Account Role
                            </label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                >
                                    <option value="" disabled className="dark:bg-slate-900">Select Role</option>
                                    <option value="SuperAdmin" className="dark:bg-slate-900">SuperAdmin</option>
                                    <option value="Admin" className="dark:bg-slate-900">Admin</option>
                                    <option value="Manager" className="dark:bg-slate-900">Manager</option>
                                    <option value="User" className="dark:bg-slate-900">User</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <HiShieldCheck size={20} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
                        <button
                            disabled={loading}
                            type="submit"
                            className="group relative px-10 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-500/30 transition-all active:scale-95 disabled:active:scale-100 flex items-center gap-3"
                        >
                            <span>Save Changes</span>
                            <HiSave size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default EditForm
