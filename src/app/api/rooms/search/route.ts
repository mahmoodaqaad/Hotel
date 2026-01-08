import { searchRooms } from "@/services/rooms";
import prisma from "@/utils/db"; // Keep prisma for POST logic if distinct
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { search } = await req.json() as { search: string };

        const isNumber = !isNaN(Number(search));

        let rooms;

        if (isNumber) {
            // لو المستخدم كتب رقم -> بحث بعدد الأشخاص
            rooms = await prisma.room.findMany({
                select: {
                    id: true,
                    name: true,
                    guest: true
                },
                where: {
                    guest: {
                        equals: search
                    }
                }
            });
        } else {
            // أول شي يبحث بالاسم فقط
            rooms = await prisma.room.findMany({
                select: {
                    id: true,
                    name: true
                },
                where: {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            });

            // لو ما لقى شي بالاسم يبحث بالمنظر
            if (rooms.length === 0) {
                rooms = await prisma.room.findMany({
                    select: {
                        id: true,
                        name: true,
                        view: true
                    },
                    where: {
                        view: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                });
            }
        }

        return NextResponse.json(rooms);

    } catch (error) {
        console.log(error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const search = req.nextUrl.searchParams.get("search") || ""
        const rooms = await searchRooms(search);
        return NextResponse.json(rooms);

    } catch (error) {
        console.log(error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
};
