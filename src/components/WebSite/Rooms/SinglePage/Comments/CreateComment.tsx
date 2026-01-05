"use client"

import { socket } from '@/lib/socketClints'
import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { HiPaperAirplane } from 'react-icons/hi'

const CreateComment = ({ roomId, userId }: { roomId: number, userId: number }) => {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (!userId) {
      toast.error("Please login to comment")
      return router.push("/login")
    }
    if (!text.trim()) return toast.error("Please write something first")

    try {
      setLoading(true)
      const res = await axios.post(`${DOMAIN}/api/comments`, { roomId, userId, text })

      const notf = res?.data?.notf
      if (notf) {
        const link = "rooms/" + notf.roomId
        const data = { ...notf.newNofticetion, link }
        socket.emit("createComment", data)
      }

      setText("")
      toast.success("Comment added successfully!")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreateComment} className="relative group">
      <div className="relative overflow-hidden bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/10 ring-1 ring-black/5 dark:ring-black/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300">
        <textarea
          placeholder="What's on your mind? Share your stay experience..."
          rows={3}
          className="w-full bg-transparent px-6 py-5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none font-medium leading-relaxed"
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => {
            if (!userId) toast.info("You'll need to log in to post your comment.")
          }}
        />

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Logged in as User #{userId || 'Guest'}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !text.trim()}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-2.5 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Post Comment
                <HiPaperAirplane className="rotate-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </form>
  )
}

export default CreateComment
