import NavBarDashboard from "@/components/Dashboard/NavBarDashboard/NavBarDashboard";
import SideBar from "@/components/Dashboard/SideBar/SideBar";
import DashboardContextProvider from "@/Context/DashboardContext";
import { IsSuperAdminOrAdminOrManagerPage } from "@/utils/roles";
import { varfiyTokenForPage } from "@/utils/verfiyToken";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await varfiyTokenForPage() as User
    if (!user) redirect("/login")
    if (!IsSuperAdminOrAdminOrManagerPage(user.role)) redirect("/403")

    return (
        <DashboardContextProvider>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                <SideBar user={user} />

                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <NavBarDashboard />
                    <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">
                        <div className="mx-auto max-w-[1600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </DashboardContextProvider>
    );
}
