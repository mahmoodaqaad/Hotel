
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ users: [], rooms: [], bookings: [] });
        }

        const [users, rooms, bookings] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } }
                    ]
                },
                take: 5,
                select: { id: true, name: true, email: true, role: true }
            }),
            prisma.room.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" }
                },
                take: 5,
                select: { id: true, name: true, price: true, images: { take: 1, select: { imageUrl: true } } }
            }),
            prisma.booking.findMany({
                where: {
                    OR: [
                        { user: { name: { contains: query, mode: "insensitive" } } },
                        { room: { name: { contains: query, mode: "insensitive" } } }
                    ]
                },
                take: 5,
                include: {
                    user: { select: { name: true } },
                    room: { select: { name: true } }
                }
            })
        ]);

        return NextResponse.json({ users, rooms, bookings });

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
