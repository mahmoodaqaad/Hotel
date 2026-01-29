
/**
 * @method POST
 * @route ~/api/users/login
 * @description lgoin user (login||sign in)=> تسجيل حساب
 * @access public
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME } from "@/utils/consant";



export const POST = async () => {
    try {
        (await cookies()).delete(JWT_COOKIE_NAME)
        return NextResponse.json({ message: "Logout" }, { status: 200 })

    }
    catch (error) {
        console.log(error);


        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }

}