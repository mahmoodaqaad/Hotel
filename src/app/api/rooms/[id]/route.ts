import { getSingleRoom } from "@/services/rooms";
import { IsSuperAdminOrAdmin } from "@/utils/CheckRole";
import prisma from "@/utils/db";
import { UpdateRoomDto } from "@/utils/Dtos";
import { NextRequest, NextResponse } from "next/server";
interface props {
    params: { id: string }
}

export const GET = async (req: NextRequest, { params: { id } }: props) => {
    try {
        const room = await getSingleRoom(id);

        if (!room) return NextResponse.json({ message: "room Not found" }, { status: 404 });

        return NextResponse.json(room, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }
}

export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {

    try {
        const isAllowd = IsSuperAdminOrAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const { id } = context.params;
        const room = await prisma.room.findUnique({ where: { id: Number(id) } })
        if (!room) return NextResponse.json({ message: "room Not found" }, { status: 404 });

        const { name, price, imageUrls, discrption } = await req.json() as UpdateRoomDto
        if (!name || !price || !discrption || !imageUrls) return NextResponse.json({ message: "ALL filed are requied" }, { status: 400 })


        await prisma.room.update({
            where: { id: Number(id) },
            data: {
                name,
                price,
                discrption,
                images: {
                    create: imageUrls.map((url: string) => ({ imageUrl: url })),
                }
            }

        })
        return NextResponse.json({ message: "Updated" }, { status: 200 })


    } catch (error) {


        return NextResponse.json({ message: "internal server error", error }, { status: 500 })


    }

}
export const DELETE = async (req: NextRequest, { params: { id } }: props) => {
    try {
        const isAllowd = IsSuperAdminOrAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const room = await prisma.room.findUnique({ where: { id: Number(id) } })
        if (!room) return NextResponse.json({ message: "room Not found" }, { status: 404 });
        if (room.status !== "available") return NextResponse.json({ message: "room is Booked" }, { status: 404 });

        await prisma.room.delete({ where: { id: Number(id) } })
        return NextResponse.json({ message: "Deleted" }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }

}