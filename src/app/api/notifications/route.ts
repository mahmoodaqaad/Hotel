import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export const POST = async (req: NextRequest) => {
    try {
        const { message, type, userId, link = "" } = await req.json();

        if (!message || !userId) {
            return NextResponse.json({ message: "message and userId are required" }, { status: 400 });
        }

        const notification = await prisma.notification.create({
            data: {
                message,
                type: type || "info",
                userId: userId,
                link: link || "", // link is required in schema
            },
        });

        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        console.error("Notification creation error:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const userId = Number(req.nextUrl.searchParams.get("userId"));

        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20 // Limit to 20 for performance
        });

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Notification fetch error:", error);
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};
