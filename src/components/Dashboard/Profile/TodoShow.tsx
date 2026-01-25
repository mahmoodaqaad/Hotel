"use client"

import { Todo } from '@prisma/client';
import React, { useState } from 'react'

const TodoShow = ({ todo }: { todo: Todo[] }) => {
    const [todos, setTodos] = useState(todo)
    const handleToggleStatus = async (id: string) => {
        try {
            // await updateTodoStatus(id); // استدعاء API لتحديث الحالة
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" } : todo
                )
            );
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };
    return (
        todos.map((item) => (
            <div
                key={item.id}
                className='flex items-start gap-2'
            >
                <div className='flex gap-1  items-center'>

                    <input type="checkbox" width={30} checked={item.status == "completed"}
                        onChange={() => handleToggleStatus(item.id)}
                        id='title'
                    />
                    <div>

                        <label htmlFor="title">

                            <p className='text-2xl'>{item.title}</p>
                        </label>
                        <div className='text-gray-600 text-xl'>
                            {item.discrption}
                        </div>
                    </div>
                </div>


            </div>
        ))
    )
}

export default TodoShow
