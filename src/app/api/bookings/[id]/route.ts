// تغغير ل مكتمل او الغاء

import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<{ id: string }>

}

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await context.params;
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }
        // find booking

        const booking = await prisma.booking.findUnique({ where: { id: id as string } })

        if (!booking) return NextResponse.json({ message: "book is not found" }, { status: 404 })

        if (booking.status !== "active") return NextResponse.json({ message: "you can not update status for this room" }, { status: 400 })

        await prisma.booking.update({
            where: { id: id as string },
            data: { status: "completed" }
        })
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: "available" }
        })

        return NextResponse.json({ message: "Completed " }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server Error", error }, { status: 500 })

    }

}

export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    /**
     * حذف من البوكنك 
     *  ريكوست حذف من البكونك
     * تغيير الغرفى للمتاح
     */
    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        // find booking

        const booking = await prisma.booking.findUnique({ where: { id: id as string } })

        if (!booking) return NextResponse.json({ message: "book is not found" }, { status: 404 })


        await prisma.booking.delete({ where: { id: id as string } })
        await prisma.room.update({
            where: { id: booking.roomId }, data: {
                status: "available"
            }
        })
        return NextResponse.json({ message: "Canceled " }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server Error", error }, { status: 500 })

    }
}