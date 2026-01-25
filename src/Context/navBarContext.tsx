"use client";
import React, { createContext, SetStateAction, useState } from "react";

interface NavBarContextProps {
    showbar: boolean
    setShowBar: React.Dispatch<SetStateAction<boolean>>

}
export const NavBarContext = createContext<NavBarContextProps | undefined>(undefined);

const NavBarContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [showbar, setShowBar] = useState(false);




    return (
        <NavBarContext.Provider value={{ showbar, setShowBar }}>
            {children}
        </NavBarContext.Provider>
    );
};

export default NavBarContextProvider;
