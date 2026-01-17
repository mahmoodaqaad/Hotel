import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
interface Props {
    params: Promise<{ id: string }>
}
export const PUT = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {

        await prisma.notification.update({
            where: { id: Number(id) },
            data: { isRead: true },
        });

        return NextResponse.json({ message: "Is Read" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};
export const PATCH = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {

        await prisma.notification.updateMany({
            where: { userId: Number(id) },
            data: { isRead: true },
        });

        return NextResponse.json({ message: "Is Read" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ message: "Internal error", error }, { status: 500 });
    }
};
