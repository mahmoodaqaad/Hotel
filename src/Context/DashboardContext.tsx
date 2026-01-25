"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
interface DashboardContextType {
    showSidebar: boolean
    activeSideBar : boolean
    setShowSidebar: Dispatch<SetStateAction<boolean>>
    setActiveSideBar: Dispatch<SetStateAction<boolean>>
}
export const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
const DashboardContextProvider = ({ children }: { children: ReactNode }) => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [activeSideBar, setActiveSideBar] = useState(false)
    return (
        <DashboardContext.Provider value={{ showSidebar, setShowSidebar, activeSideBar, setActiveSideBar }}>
            {children}
        </DashboardContext.Provider>
    )
}

export default DashboardContextProvider
