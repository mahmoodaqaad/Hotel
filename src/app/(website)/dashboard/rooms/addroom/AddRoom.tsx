"use client"

import { LoadingPage } from '@/app/loading'
import { User } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { HiPlus, HiX, HiUpload, HiCurrencyDollar, HiIdentification, HiDocumentText } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { DOMAIN } from '@/utils/consant'

const AddRoom = ({ user }: { user: User }) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [discrption, setDiscrption] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (user.role !== "Admin" && user.role !== "SuperAdmin") {
            return toast.error("Unauthorized: Access denied")
        }

        if (!name || !price || !discrption || images.length === 0) {
            return toast.error("Please fill all fields and upload at least one image")
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
            await axios.post(`${DOMAIN}/api/rooms`, { name, price: Number(price), discrption, imageUrls })

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
                className="premium-card p-5 md:p-10 lg:p-12"
            >
                <div className="mb-8 md:mb-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add New Room</h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">Create a new luxury experience for your guests</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {/* Main Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description - Full Width */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiDocumentText className="text-blue-500" /> Room Description
                        </label>
                        <textarea
                            placeholder="Describe the room's unique features, view, and amenities..."
                            className="w-full min-h-[120px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={discrption}
                            onChange={e => setDiscrption(e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiUpload className="text-blue-500" /> Room Gallery
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            <AnimatePresence mode="popLayout">
                                {images.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 dark:border-white/10"
                                    >
                                        <Image
                                            layout="fill"
                                            objectFit="cover"
                                            src={URL.createObjectURL(img)}
                                            alt={`Preview ${i}`}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                            >
                                                <HiX size={20} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-white/90 dark:bg-slate-900/90 rounded-lg text-[8px] font-black uppercase tracking-tighter">
                                            {(img.size / 1024 / 1024).toFixed(1)} MB
                                        </div>
                                    </motion.div>
                                ))}

                                <motion.label
                                    className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all text-slate-400 hover:text-blue-500"
                                >
                                    <HiPlus size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
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
                            className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:active:scale-100 flex items-center gap-3"
                        >
                            <span>Add Room</span>
                            <HiPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AddRoom
