import React from 'react'
import { HiUser, HiMail, HiPhone, HiChatAlt, HiPaperAirplane } from 'react-icons/hi'

const Form = () => {
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <HiUser size={20} />
                        </div>
                        <input
                            required
                            type="text"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <HiMail size={20} />
                        </div>
                        <input
                            required
                            type="email"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <HiPhone size={20} />
                        </div>
                        <input
                            type="tel"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="+1 (234) 567-890"
                        />
                    </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <HiChatAlt size={20} />
                        </div>
                        <input
                            required
                            type="text"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Booking Inquiry"
                        />
                    </div>
                </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 min-h-[150px] resize-none"
                    rows={5}
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
            >
                <span>Send Message</span>
                <HiPaperAirplane className="rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
        </form>
    )
}

export default Form
