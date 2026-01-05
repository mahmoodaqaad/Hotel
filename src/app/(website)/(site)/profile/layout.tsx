"use client"

import React from "react";
import SideBar from "@/components/WebSite/profile/SideBar/SideBar";

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-[120px] pb-24 md:pb-0">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar container */}
                    <div className="w-full md:w-72 shrink-0">
                        <SideBar />
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-white/5 min-h-[600px]">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
