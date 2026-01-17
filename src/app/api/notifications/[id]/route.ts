import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<{ id: string }>
}

export const GET = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {

        if (!id) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: Number(id) },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(notifications, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};





