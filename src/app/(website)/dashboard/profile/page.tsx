import { varfiyMyAccount } from '@/utils/verfiyToken'
import TodoPage from './Todo';
import EditPassword from './EditPassword';
import { HiBadgeCheck, HiCalendar, HiMail, HiUserCircle } from 'react-icons/hi';

const page = async () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await varfiyMyAccount() as any;
    console.log(user);
    
    if (!user) return null;

    return (
        <section className='space-y-8'>
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your admin details and tasks.</p>
            </div>

            {/* Profile Info Card */}
            <div className="premium-card p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none" />

                {/* Avatar */}
                <div className="shrink-0 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                            <HiUserCircle className="text-8xl md:text-9xl text-slate-200 dark:text-slate-800" />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                <HiBadgeCheck size={16} />
                                {user?.role}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                {new Date(user?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <HiMail size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                <HiCalendar size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200">{new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Todo Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-1 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-white/5 h-full">
                    <TodoPage />
                </div>

                {/* Password Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-white/5 h-full">
                    <EditPassword />
                </div>
            </div>
        </section>
    )
}

export default page
