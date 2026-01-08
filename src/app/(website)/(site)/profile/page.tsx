import { varfiyMyAccount } from '@/utils/verfiyToken'
import { User } from '@prisma/client'
import React from 'react'
import { HiMail, HiCalendar, HiBadgeCheck, HiUserCircle } from 'react-icons/hi'

const page = async () => {

    const user = await varfiyMyAccount() as User

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your account details and preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="premium-card p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar Placeholder */}
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 p-1 shadow-2xl shadow-blue-500/30">
                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                <HiUserCircle className="text-9xl text-slate-200 dark:text-slate-800" />
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full" title="Active" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-6 w-full">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{user.name}</h2>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                <HiBadgeCheck size={16} />
                                {user.role}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors hover:border-blue-200 dark:hover:border-blue-800">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <HiMail size={20} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors hover:border-orange-200 dark:hover:border-orange-800">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                    <HiCalendar size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status / Stats Placeholder (Could be expanded) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">Active</span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Account Status</span>
                </div>
                {/*  We could add more stats here later if we fetch them */}
            </div>
        </div>
    )
}

export default page
