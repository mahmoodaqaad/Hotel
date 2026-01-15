import React from 'react'
import Form from './Form'
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi'

const ConectForm = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-sm">Get in Touch</h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                        Let&apos;s Start a <span className="text-blue-600">Conversation</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Have questions about our rooms or services? We&apos;re here to help you plan your perfect stay. Reach out to us anytime.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Contact Information Side */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="premium-card p-6 flex items-center gap-6 group hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <HiMail size={28} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</h4>
                                <p className="font-bold text-slate-900 dark:text-white truncate">mahmmodaqaad@gmail.com</p>
                            </div>
                        </div>

                        <div className="premium-card p-6 flex items-center gap-6 group hover:border-orange-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                <HiPhone size={28} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</h4>
                                <p className="font-bold text-slate-900 dark:text-white">+970 599923041</p>
                            </div>
                        </div>

                        <div className="premium-card p-6 flex items-center gap-6 group hover:border-green-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <HiLocationMarker size={28} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Visit Us</h4>
                                <p className="font-bold text-slate-900 dark:text-white">khan younis</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-blue-600 text-white shadow-2xl space-y-4">
                            <div className="flex items-center gap-3">
                                <HiClock size={24} />
                                <h4 className="font-bold text-xl">Reception Desk</h4>
                            </div>
                            <p className="text-blue-100/80 font-medium">Our reception is available 24/7 for check-ins and inquiries.</p>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                                <span>Mon - Sun</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full">Open 24h</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="w-full lg:flex-1">
                        <div className="premium-card p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110" />
                            <div className="relative z-10">
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Send a Message</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">We&apos;ll get back to you within 24 hours.</p>
                                </div>
                                <Form />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ConectForm
