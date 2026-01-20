"use client"

import { LoadingPage } from '@/app/loading'
import { RoomType, User } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiPlus, HiX, HiUpload, HiCurrencyDollar, HiIdentification, HiDocumentText, HiEye, HiUsers, HiTemplate, HiHome } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { DOMAIN } from '@/utils/consant'

const AddRoom = ({ user }: { user: User }) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [discrption, setDiscrption] = useState("")
    // Initialize as string for input compatibility, convert for DTO if needed
    const [guest, setGuest] = useState("")
    const [size, setSize] = useState("")
    const [view, setView] = useState("")
    const [roomType, setRoomType] = useState<RoomType>("Single") // Default to first enum value
    const [images, setImages] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (user.role !== "Admin" && user.role !== "SuperAdmin") {
            return toast.error("Unauthorized: Access denied")
        }

        if (!name || !price || !discrption || images.length === 0 || !guest || !size || !view || !roomType) {
            return toast.error("Please fill all fields and upload at least one image")
        }
        const guestNum = Number(guest)
        if ((roomType === "Single" && guestNum > 1) || (roomType === "Double" && guestNum > 2) || (roomType === "Deluxe" && guestNum > 3)) {
            return toast.error("Room type doesn't match guest count")
        }
        try {
            setLoading(true)
            const uploadPromises = images.map(async (image) => {
                const formData = new FormData()
                formData.append("file", image)

                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

                if (!uploadPreset || !cloudName) {
                    console.error("Missing Cloudinary environment variables:", { uploadPreset, cloudName });
                    throw new Error("Cloudinary configuration is missing. Please check your .env file.");
                }

                formData.append("upload_preset", uploadPreset)
                formData.append("cloud_name", cloudName)

                const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
                return res.data.secure_url;
            })

            const imageUrls = await Promise.all(uploadPromises)

            // Ensure types match API expectations
            await axios.post(`${DOMAIN}/api/rooms`, {
                name,
                price: Number(price),
                discrption,
                imageUrls,
                guest: guest, // Send as number per DTO
                size,
                view,
                roomType
            })

            toast.success("Room added successfully!")
            router.push("/dashboard/rooms?pageNumber=1")
            router.refresh()
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to add room")
            } else {
                toast.error("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="max-w-4xl mx-auto">
            {loading && <LoadingPage />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-5 md:p-10 lg:p-12 mb-20"
            >
                <div className="mb-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <HiHome size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add New Room</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create a new luxury experience for your guests</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Room Name */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiIdentification className="text-blue-500" /> Room Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Royal Presidential Suite"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiCurrencyDollar className="text-blue-500" /> Price per Night
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-10 pr-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* View */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiEye className="text-blue-500" /> View Type
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Ocean View, City Skyline"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={view}
                                onChange={e => setView(e.target.value)}
                            />
                        </div>

                        {/* Size */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiTemplate className="text-blue-500" /> Room Size
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 50m², 500 sq ft"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={size}
                                onChange={e => setSize(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Guest Capacity */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiUsers className="text-blue-500" /> Max Guests
                            </label>
                            <input
                                type="number"
                                placeholder="2"
                                min="1"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={guest}
                                onChange={e => setGuest(e.target.value)}
                            />
                        </div>

                        {/* Room Type */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiHome className="text-blue-500" /> Room Classification
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    value={roomType}
                                    onChange={e => setRoomType(e.target.value)}
                                >
                                    {/* Matches Prisma Enum: Single, Double, Deluxe, Other */}
                                    <option value="Single" className="dark:bg-slate-900">Single Room</option>
                                    <option value="Double" className="dark:bg-slate-900">Double Room</option>
                                    <option value="Deluxe" className="dark:bg-slate-900">Deluxe Suite</option>
                                    <option value="Other" className="dark:bg-slate-900">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description - Full Width */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiDocumentText className="text-blue-500" /> Description
                        </label>
                        <textarea
                            placeholder="Describe the room's unique amenities, atmosphere, and special features..."
                            className="w-full min-h-[150px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={discrption}
                            onChange={e => setDiscrption(e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiUpload className="text-blue-500" /> Room Gallery
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <AnimatePresence mode="popLayout">
                                {images.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10"
                                    >
                                        <Image
                                            fill
                                            className="object-cover"
                                            src={URL.createObjectURL(img)}
                                            alt={`Preview ${i}`}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="w-10 h-10 bg-red-500/90 text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <HiX size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                <motion.label
                                    layout
                                    className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-slate-400 hover:text-blue-500"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-inherit transition-colors">
                                        <HiPlus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Add Photo</span>
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files || [])])}
                                    />
                                </motion.label>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:active:scale-100 flex items-center gap-3"
                        >
                            <span>{loading ? "Creating..." : "Create Room"}</span>
                            {!loading && <HiPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AddRoom
