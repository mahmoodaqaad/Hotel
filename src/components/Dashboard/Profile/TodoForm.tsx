"use client"

import { Todo } from '@prisma/client'
import SingleTodo from './SingleTodo'
import Form from './Form'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiClipboardList } from 'react-icons/hi'

const TodoForm = ({ userId, todo }: { userId: string, todo: Todo[] }) => {

    const [todos, setTodos] = useState(todo)

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <Form userId={userId} setTodos={setTodos} />
            </div>

            <div className='flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700'>
                <AnimatePresence mode='popLayout'>
                    {todos.length > 0 ? (
                        todos.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", duration: 0.4 }}
                            >
                                <SingleTodo setTodos={setTodos} todo={item} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                <HiClipboardList className="text-3xl text-slate-400" />
                            </div>
                            <p className="font-medium text-slate-500">No tasks yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    )
}

export default TodoForm
