"use client"

import { LoadingBtn } from '@/app/loading'
import { ModeContext } from '@/Context/ModeContext'
import { NavBarContext } from '@/Context/navBarContext'
import { DOMAIN } from '@/utils/consant'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'

const Logout = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const context = useContext(ModeContext)
    if (!context) {
        throw new Error("Error in mode context")
    }
    const { isDarkmode } = context
    const context2 = useContext(NavBarContext)

    if (!context2) throw new Error("error in context nav bar")
    const { setShowBar } = context2
    const logoutHandler = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "you want to log out !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Log out",
            background: !isDarkmode ? "#444" : "#fff",
            color: isDarkmode ? "#333" : "#fff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    setLoading(true)
                    await axios.post(`${DOMAIN}/api/users/logout`)
                    

                    router.replace("/login");
                    router.refresh();
                    setShowBar(false)
                } catch (error) {
                    console.log(error);

                }

            }
        })
    }


    return (
        <button
            disabled={loading}
            onClick={logoutHandler}
            className='bg-gray-700 text-gray-200 px-3 py-2 rounded text-xl hover:bg-gray-500 transition-colors disabled:cursor-wait'>

            {
                loading ?
                    <LoadingBtn /> : "Logout"
            }
        </button>
    )
}

export default Logout
