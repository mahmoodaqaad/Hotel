import { getAllRooms } from "@/services/rooms";
import { IsSuperAdminOrAdmin } from "@/utils/CheckRole";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import prisma from "@/utils/db";
import { CreateRoomDto } from "@/utils/Dtos";
import { CreateRoomSchema } from "@/utils/schema";
import { RoomType, Guest } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1
        const limit = Number(req.nextUrl.searchParams.get("limit")) || ARTICLE_PER_PAGE
        const search = req.nextUrl.searchParams.get("search") || ""
        const sort = req.nextUrl.searchParams.get("sort") || "createdAt"
        const order = req.nextUrl.searchParams.get("order") === "asc" ? "asc" : "desc"
        const filter = req.nextUrl.searchParams.get("filter") || ""

        // Use strict type assertion for order as "asc" | "desc"
        const rooms = await getAllRooms({
            pageNumber,
            search,
            sort,
            order: order as "asc" | "desc",
            filter,
            limit
        })

        return NextResponse.json(rooms, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }
}
export const POST = async (req: NextRequest) => {
    try {
        const isAllowd = IsSuperAdminOrAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }


        const body = (await req.json()) as CreateRoomDto


        const validtion = CreateRoomSchema.safeParse(body)
        if (!validtion.success) return NextResponse.json({ message: validtion.error.errors[0].message }, { status: 400 })
        const { name, price, imageUrls, discrption, guest, size, view, roomType } = body

        // return console.log(body);

        const room = await prisma.room.create({
            data: {
                name,
                price,
                discrption,
                size,
                view,
                roomType: roomType as RoomType,
                guest: guest as Guest,
                images: {
                    create: imageUrls.map((url: string) => ({ imageUrl: url })),
                },
            },
            include: { images: true },
        });

        return NextResponse.json(room, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "500 intrenal error" }, { status: 500 })

    }


}