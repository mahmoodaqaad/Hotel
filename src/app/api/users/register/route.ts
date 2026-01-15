import prisma from "@/utils/db";
import { RegsiterDto } from "@/utils/Dtos";
import { setCookie } from "@/utils/generateToken";
import { RegisterSchema } from "@/utils/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as RegsiterDto

        const validation = RegisterSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
        }
        const user = await prisma.user.findFirst({ where: { email: body.email } })

        if (user) {
            return NextResponse.json({ message: "this user already Registered" }, { status: 400 })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(body.password as string, salt)

        const newUser = await prisma.user.create({
            data: {
                email: body.email as string,
                name: body.name as string,
                password: hashPassword,

            }, select: {
                id: true,
                name: true,
                role: true,
                email: true

            }

        })
        const cookie = setCookie({
            id: newUser.id,
            name: newUser.name,
            role: newUser?.role,
            email: newUser?.email
        })
        return NextResponse.json({ ...newUser, message: "Registered" }, {
            status: 201, headers: { "set-Cookie": cookie }
        })




    } catch (error) {
        console.log("*******************");
        console.log(error);

        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }


}