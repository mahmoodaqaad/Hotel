import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export const GET = async (req: NextRequest) => {
    try {
        // Define "online" as having been seen in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const onlineUsers = await prisma.user.findMany({
            where: {
                lastSeen: {
                    gte: fiveMinutesAgo,
                },
            },
            select: {
                id: true,
                name: true,
                role: true,
                lastSeen: true,
            },
        });

        return NextResponse.json(onlineUsers, { status: 200 });
    } catch (error) {
        console.error("Online users fetch error:", error);
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};
