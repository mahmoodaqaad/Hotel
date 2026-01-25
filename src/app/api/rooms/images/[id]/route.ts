import prisma from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"


export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await context.params; // ✅ استخراج `id` من `context`

        const roomId = id as string;
        if (isNaN(roomId)) {
            return NextResponse.json({ message: "Invalid room ID" }, { status: 400 });
        }

        const room = await prisma.roomImage.findUnique({ where: { id: roomId } });

        if (!room) {
            return NextResponse.json({ message: "room not found" }, { status: 404 });
        }

        await prisma.roomImage.delete({ where: { id: roomId } });

        return NextResponse.json({ message: "room deleted" }, { status: 200 });

    } catch (error) {
        console.error(" Error deleting room:", error);

        return NextResponse.json(
            { message: "internal server error", error: String(error) },
            { status: 500 }
        );
    }
};
