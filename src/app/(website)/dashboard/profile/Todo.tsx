import { varfiyTokenForPage } from '@/utils/verfiyToken'
import React from 'react'
import TodoForm from '@/components/Dashboard/Profile/TodoForm'
import { getMyTodos } from '@/services/todos'

const TodoPage = async () => {
  const user = await varfiyTokenForPage()
  const todo = await getMyTodos(Number(user?.id))

  return (
    <div className="h-full flex flex-col p-6 lg:p-8">
      <div className="mb-6">
        <h2 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>My Tasks</h2>
        <p className="text-slate-500 text-sm font-medium">Keep track of your pending activities.</p>
      </div>

      <div className='flex-1 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 border border-slate-100 dark:border-white/5'>
        <TodoForm userId={Number(user?.id)} todo={todo} />
      </div>
    </div>
  )
}

export default TodoPage
