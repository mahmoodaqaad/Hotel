import { IsSuperAdmin } from "@/utils/CheckRole"
import prisma from "@/utils/db"
import { updateUserDto } from "@/utils/Dtos"
import { supabase } from "@/utils/supabase"
import { varfiyToken } from "@/utils/verfiyToken"
import { NextRequest, NextResponse } from "next/server"

interface Props {
    params: Promise<{ id: string }>
}

export const GET = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const isAllowd = IsSuperAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: id as string


            },
            include: {
                Saved: true
            }

        })
        if (!user) return NextResponse.json({ message: "user Not found" }, { status: 404 });

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }

}
export const PUT = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;

    try {
        const user = varfiyToken(req)
        const isAllowd = IsSuperAdmin(req)

        if (!isAllowd && user?.id !== id) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const isExistUser = await prisma.user.findUnique({ where: { id: id as string } })
        if (!isExistUser) return NextResponse.json({ message: "user Not found" }, { status: 404 });



        const { name, email, role } = (await req.json()) as updateUserDto


        await prisma.user.update({
            where: { id: id as string },
            data: {
                name, email, role

            }
        })

        // update user info by anther admin

        if (user?.id !== id) {
            // stored in DB 
            const notification = await prisma.notification.create({
                data: {
                    message: `the ${user?.name} (${user?.role}) update your informations `,
                    link: role !== "User" ? "/dashboard/profile" : "/profile",
                    type: "auth",
                    userId: id as string,
                }
            })

            // real time 
            await supabase.channel(`notifications-${id}`).send({
                type: "broadcast",
                event: "new-notification",
                payload: notification
            })
        }

        return NextResponse.json({ message: "updated" }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }

}

export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;

    try {
        const isAllowd = IsSuperAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const isExistUser = await prisma.user.findUnique({ where: { id: id as string } })
        if (!isExistUser) return NextResponse.json({ message: "user Not found" }, { status: 404 });

        await prisma.user.delete({
            where: { id: id as string },

        })
        return NextResponse.json({ message: "Deleted" }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }

}

