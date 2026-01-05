"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { socket } from '@/lib/socketClints'
import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { HiMail, HiLockClosed } from 'react-icons/hi'
import Link from 'next/link'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (loading) return

        try {
            if (!email) return toast.error("Email is required")
            if (!password) return toast.error("Password is required")

            setLoading(true)
            const res = await axios.post(`${DOMAIN}/api/users/login`, { email, password })
            const user = res?.data.user

            socket.emit("addNewUser", user)

            toast.success("Welcome back! Login successful")
            router.replace("/")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Login failed. Please try again."
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleLogin} className='space-y-6'>
            <div className='space-y-2'>
                <div className='relative group'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors'>
                        <HiMail size={20} />
                    </div>
                    <input
                        type="email"
                        required
                        placeholder='Email Address'
                        className='w-full bg-white/5 dark:bg-slate-800/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className='space-y-2'>
                <div className='relative group'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors'>
                        <HiLockClosed size={20} />
                    </div>
                    <input
                        type="password"
                        required
                        placeholder='Password'
                        className='w-full bg-white/5 dark:bg-slate-800/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2'
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Sign In"}
            </motion.button>

            <div className="text-center pt-6">
                <p className="text-slate-400 font-medium">
                    Don't have an account? {' '}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                        Create one now
                    </Link>
                </p>
            </div>
        </form>
    )
}

const LoginPage = () => {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-40 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/20 shadow-2xl rounded-[2.5rem] p-8 md:p-10">
                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold text-white mb-2 tracking-tight"
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-400 font-medium"
                        >
                            Enter your credentials to access your account
                        </motion.p>
                    </div>

                    <LoginForm />
                </div>
            </motion.div>
        </main>
    )
}

export default LoginPage
