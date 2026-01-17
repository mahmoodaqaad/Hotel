"use client"
import { NavBarContext } from '@/Context/navBarContext'
import Link from 'next/link'
import React, { useContext } from 'react'
import stay from "./header.module.css"
import { User } from '@prisma/client'
import Logout from '@/components/Auth/Logout/Logout'
const NavBar = ({ user }: { user: User }) => {
    const context = useContext(NavBarContext)

    if (!context) throw new Error("error in context nav bar")
    const { showbar, setShowBar } = context



    return (
        <div className={`${stay.navLinks} flex items-center pr-12  ${showbar ? stay.showLink : ""}`}>
            <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform duration-[350]' href={"/"}>Home</Link>
            <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform' href={"/rooms"}>Our Rooms</Link>
            <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform' href={"/restaurant"}>Restaurant</Link>
            <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform' href={"/about"}>About Us</Link>
            {/* <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform' href={"/blog"}>Blog</Link> */}
            <Link onClick={() => { setShowBar(false); }} className='px-2 text-lg text-red-100 hover:-translate-y-1 transition-transform' href={"/contact"}>Contact</Link>
            {
                user ?

                    < div className='md:hidden py-4'>

                        {

                            (user && (user.role === "SuperAdmin" || user.role === "Admin" || user.role === "Manager"))
                            &&
                            <Link onClick={() => { setShowBar(false); }}
                                className='bg-sky-500   text-white px-3 py-2' href={"/dashboard"}>dashboard</Link>
                        }



                        <div className='mt-5'>
                            <Logout />
                        </div >
                    </div>
                    : <div className='flex md:hidden gap-3 flex-col p-2'>
                        <Link onClick={() => { setShowBar(false); }} className='bg-teal-700 px-4 py-2 rounded-md hover:bg-gray-900' href={"/login"}>Login</Link>
                        <Link onClick={() => { setShowBar(false); }} className='bg-cyan-700 px-2 py-2 rounded-md hover:bg-gray-900' href={"/register"}>Register</Link>
                    </div>
            }
        </div>
    )
}

export default NavBar
