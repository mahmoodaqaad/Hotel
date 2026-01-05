"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { HiUser, HiMail, HiShieldCheck, HiLockClosed, HiUserAdd } from 'react-icons/hi'
import { LoadingPage } from '@/app/loading'
import { DOMAIN } from '@/utils/consant'

const AddForm = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email || !role || !password) {
            return toast.error("Please fill in all fields")
        }

        try {
            setLoading(true)
            await axios.post(`${DOMAIN}/api/users`, { name, email, password, role })

            toast.success("User account created successfully")
            router.push("/dashboard/users?pageNumber=1")
            router.refresh()
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to add user")
            } else {
                toast.error("An unexpected error occurred")
            }
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
                className="premium-card p-8 md:p-12"
            >
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create User Account</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add a new member to your management team</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiUser className="text-blue-500" /> Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiMail className="text-blue-500" /> Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role Selection */}
                        <div className="space-y-2">
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
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                    <HiUserAdd size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiLockClosed className="text-blue-500" /> Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-3"
                        >
                            <span>Initialize Account</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AddForm
