"use client"
import { LoadingBtn } from '@/app/loading'
import { ModeContext } from '@/Context/ModeContext'
import { DOMAIN } from '@/utils/consant'
import { Todo } from '@prisma/client'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

interface SingleTodoProps {
  todo: Todo
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const SingleTodo = ({ todo, setTodos }: SingleTodoProps) => {
  const [loading, setLoading] = useState(false)
  const context = useContext(ModeContext)

  const { isDarkmode } = context || { isDarkmode: false } // Fallback if context missing, though page should wrap it

  const handleToggleStatus = async (id: number) => {
    try {
      await axios.put(`${DOMAIN}/api/todo/myTodo/${id}`)
      // Assuming existing API toggles it. 
      // Ideally we should send status, but let's trust existing logic for now.

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status")
    }
  };

  const deleteTodo = async (id: number) => {
    Swal.fire({
      title: "Delete this task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red
      cancelButtonColor: "#64748B", // Slate
      confirmButtonText: "Delete",
      background: isDarkmode ? "#1E293B" : "#fff",
      color: isDarkmode ? "#fff" : "#1E293B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
          await axios.delete(`${DOMAIN}/api/todo/myTodo/${id}`)
          setTodos(prev => prev.filter(item => item.id !== id))

          toast.success("Task deleted")
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message || "Failed to delete task");
          } else {
            toast.error("An unexpected error occurred");
          }
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const isCompleted = todo.status === "completed";

  return (
    <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${isCompleted
      ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 opacity-70'
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800'
      }`}>

      {/* Checkbox */}
      <div
        onClick={() => handleToggleStatus(todo.id)}
        className={`mt-1 w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors ${isCompleted
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
          }`}
      >
        {isCompleted && <HiCheckCircle size={20} />}
      </div>

      {/* Content */}
      <div className="flex-1 cursor-pointer" onClick={() => handleToggleStatus(todo.id)}>
        <h3 className={`font-semibold text-lg transition-all ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {todo.title}
        </h3>
        <p className={`text-sm mt-1 transition-all ${isCompleted ? 'line-through text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
          {todo.discrption}
        </p>
      </div>

      {/* Action */}
      <button
        onClick={() => deleteTodo(todo.id)}
        disabled={loading}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Delete Task"
      >
        {loading ? <LoadingBtn /> : <MdDelete size={22} />}
      </button>

    </div>
  )
}

export default SingleTodo
