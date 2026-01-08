"use client"
import { LoadingPage } from '@/app/loading'
import { ModeContext } from '@/Context/ModeContext'
import { DOMAIN } from '@/utils/consant'
import { Room, RoomImage } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { LuImagePlus, LuSave, LuTrash } from 'react-icons/lu'
import { HiPencilAlt, HiCurrencyDollar, HiInformationCircle, HiPhotograph } from 'react-icons/hi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

interface RoomWithImages extends Room {
    images: RoomImage[]
}

const EditRoom = ({ room }: { room: RoomWithImages }) => {
    const context = useContext(ModeContext)
    if (!context) {
        throw new Error("error in context mode in edit form")

    }
    const [name, setName] = useState(room.name)
    const [price, setPrice] = useState(Number(room.price))
    const [discrption, setDiscrption] = useState(room.discrption)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [imagesServer, setImagesServer] = useState<any[]>(room.images as any[])
    const [images, setImages] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { isDarkmode } = context


    const showImageFromServer = imagesServer.map((img: { imageUrl: string, id: string }, i: number) => {
        async function deleteImgFromServer(id: string) {
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                    background: !isDarkmode ? "#444" : "#fff",
                    color: isDarkmode ? "#333" : "#000",
                });

                if (result.isConfirmed) {
                    await axios.delete(`${DOMAIN}/api/rooms/images/${id}`)
                    const newImgServer = imagesServer.filter((img: { id: string }) => img.id !== id)
                    setImagesServer(newImgServer)
                    toast.success("Image deleted")
                }
            } catch (error: any) {
                console.log(error);
                toast.error(error.response?.data?.message || "Failed to delete image")
            }
        }

        return (
            <div
                key={i}
                className='relative group rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-white/10'
            >
                <div className="aspect-square relative">
                    <Image
                        unoptimized={true}
                        fill
                        className="object-cover"
                        src={img.imageUrl} alt=''
                    />
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={(e) => { e.preventDefault(); deleteImgFromServer(img.id); }}
                        className='bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg'
                        title="Delete Image"
                    >
                        <LuTrash size={20} />
                    </button>
                </div>
            </div>
        )
    })

    const handleEditRoom = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (!name) return toast.error("Name is required");
            if (!price) return toast.error("Price is required");

            setLoading(true)

            const uplpadProductImgs = []
            if (images.length) {
                const uploadPromises = images.map(async (image) => {
                    const formData = new FormData()
                    formData.append("file", image)
                    formData.append("upload_preset", "HotelWithNext")
                    formData.append("cloud_name", "ddoj9gsda")
                    const res = await axios.post(`https://api.cloudinary.com/v1_1/ddoj9gsda/image/upload`, formData);
                    return res.data.secure_url;
                })
                const urls = await Promise.all(uploadPromises)
                uplpadProductImgs.push(...urls)
            }

            // Note: using relative path or DOMAIN constant for consistency? 
            // Original used http://localhost:3000 explicitly which is bad. 
            // DOMAIN constant is better.
            await axios.put(`${DOMAIN}/api/rooms/${room.id}`, { name, price, discrption, imageUrls: uplpadProductImgs })

            toast.success("Room updated successfully")
            router.push("/dashboard/rooms?pageNumber=1")
            router.refresh()

        } catch (e: any) {
            console.log(e);
            toast.error(e.response?.data?.message || "Failed to update room")
        } finally {
            setLoading(false)
        }
    }

    const handleNewInfoImageDelete = (imgToDelete: File) => {
        const newImg = images.filter(item => item !== imgToDelete)
        setImages(newImg)
    }

    return (
        <div className="max-w-4xl mx-auto">
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
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Room Details</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Update room information, pricing, and gallery</p>
                </div>

                <form onSubmit={handleEditRoom} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiPencilAlt className="text-blue-500" /> Room Name
                            </label>
                            <input
                                type="text"
                                placeholder='e.g. Deluxe Ocean View'
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <HiCurrencyDollar className="text-blue-500" /> Price Per Night
                            </label>
                            <input
                                type="number"
                                placeholder='0.00'
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiInformationCircle className="text-blue-500" /> Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder='Room details and amenities...'
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                            value={discrption}
                            onChange={e => setDiscrption(e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <HiPhotograph className="text-blue-500" /> Room Gallery
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Upload Button */}
                            <label className='aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group'>
                                <LuImagePlus className='text-3xl text-slate-400 group-hover:text-blue-500 transition-colors' />
                                <span className="text-xs font-bold text-slate-400 mt-2 group-hover:text-blue-500">Add Photos</span>
                                <input
                                    hidden
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files || [])])}
                                />
                            </label>

                            {/* Existing Images */}
                            {showImageFromServer}

                            {/* New Images Preview */}
                            {images.map((img, i) => (
                                <div key={`new-${i}`} className='relative group rounded-xl overflow-hidden shadow-md border border-green-500/30'>
                                    <div className="aspect-square relative">
                                        <Image
                                            height={120}
                                            width={120}
                                            className="object-cover w-full h-full"
                                            src={URL.createObjectURL(img)} alt='New upload'
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleNewInfoImageDelete(img); }}
                                            className='bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg'
                                            title="Remove"
                                        >
                                            <LuTrash size={20} />
                                        </button>
                                    </div>
                                    <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        NEW
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative px-10 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-500/30 transition-all active:scale-95 disabled:active:scale-100 flex items-center gap-3"
                        >
                            <span>Save Changes</span>
                            <LuSave size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default EditRoom
