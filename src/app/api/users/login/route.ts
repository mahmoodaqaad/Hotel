import prisma from "@/utils/db";
import { LoginSchema } from "@/utils/schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { LoginDto } from "@/utils/Dtos";
import { setCookie } from "@/utils/generateToken";


/**
 * @method POST
 * @route ~/api/users/login
 * @description lgoin user (login||sign in)=> تسجيل حساب
 * @access public
 */



export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as LoginDto

        const valdation = LoginSchema.safeParse(body)
        if (!valdation.success) {

            return NextResponse.json({ message: valdation.error.errors[0].message }, { status: 400 })
        }
        const user = await prisma.user.findUnique({ where: { email: body.email } })
        if (!user)
            return NextResponse.json({ message: "invalid email or password" }, { status: 404 })

        const isPassowrdMatch = await bcrypt.compare(body.password as string, user.password)

        if (!isPassowrdMatch) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 })

        }

        const cookie = setCookie({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
        })

        return NextResponse.json(
            { message: "Authenticated", user: user },
            {
                status: 200,
                headers: { "set-Cookie": cookie }
            })
    }
    catch (error) {
        console.log("Login API Error:", error);
        return NextResponse.json(
            { message: "internal server error", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }

}

