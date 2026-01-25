import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { text, userId, roomId } = body;

        // Validate comment text
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 })
        }

        if (text.trim().length > 1000) {
            return NextResponse.json({ message: "Comment too long (max 1000 characters)" }, { status: 400 })
        }

        // Minimal creation
        const comment = await prisma.comment.create({
            data: {
                text: text.trim(),
                userId: userId,
                roomId: roomId,
            }
        });

        // Add Notification for Admins
        const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } });
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
        const admins = await prisma.user.findMany({
            where: {
                role: "SuperAdmin",
                id: { not: userId }
            },
            select: { id: true }
        });

        // Create all notifications at once
        const notifications = admins.map(admin => ({
            message: `${user?.name} commented on room ${room?.name}`,
            userId: admin.id,
            type: "comment",
            link: `/rooms/${roomId}`
        }))

        await prisma.notification.createMany({ data: notifications })

        // Broadcast notifications
        for (const admin of admins) {
            const notification = await prisma.notification.findFirst({
                where: { userId: admin.id },
                orderBy: { createdAt: 'desc' }
            })

            await supabase.channel(`notifications-${admin.id}`).send({
                type: 'broadcast',
                event: 'new-notification',
                payload: notification,
            });
        }

        return NextResponse.json({ message: "Comment Added", comment }, { status: 201 });
    } catch (error) {
        console.error("FATAL ERROR:", error);
        return NextResponse.json({
            message: "Server Error",
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
};
