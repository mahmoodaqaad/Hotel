"use client"
import { LoadingBtn } from '@/app/loading'
import { DOMAIN } from '@/utils/consant'
import { Todo } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import { HiPlus, HiPencilAlt, HiViewList } from 'react-icons/hi'
import { toast } from 'react-toastify'

const Form = ({ userId, setTodos }: { userId: number, setTodos: React.Dispatch<React.SetStateAction<Todo[]>> }) => {
    const [title, setTitle] = useState("")
    const [discrption, setDiscrption] = useState("") // Keeping typo "discrption" from schema for now
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const AddTask = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if (!title) return toast.error("Title is required")
            if (!discrption) return toast.error("Description is required")
            setLoading(true)
            const res = await axios.post(`${DOMAIN}/api/todo`, { userId, title, discrption })

            toast.success("Task Added Successfully")
            setTodos((prev) => [res.data, ...prev])
            setTitle("")
            setDiscrption("")
            router.refresh()
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to add task");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={AddTask} className="space-y-4">
            <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <HiPencilAlt size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Task Title..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <HiViewList size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Description (optional)..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={discrption}
                    onChange={e => setDiscrption(e.target.value)}
                />
            </div>

            <button
                disabled={loading}
                type='submit'
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {loading ? <LoadingBtn /> : (
                    <>
                        <HiPlus size={20} />
                        <span>Add Task</span>
                    </>
                )}
            </button>
        </form>
    )
}

export default Form
