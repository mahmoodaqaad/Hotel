import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: Number(userId) },
            data: { lastSeen: new Date() },
        });

        return NextResponse.json({ message: "Activity updated" }, { status: 200 });
    } catch (error) {
        console.error("Activity update error:", error);
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};
