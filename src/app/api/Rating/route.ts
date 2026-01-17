import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { roomId, userId, rating } = body;

        if (!roomId || !userId || !rating) {
            return NextResponse.json({ message: 'All Fields Required' }, { status: 400 });
        }

        // Validate rating value
        const ratingValue = Number(rating)
        if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            return NextResponse.json({
                message: 'Rating must be an integer between 1 and 5'
            }, { status: 400 })
        }

        // تحقق إذا المستخدم قيّم سابقاً
        const existingRating = await prisma.rating.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId,
                },
            },
        });

        if (existingRating) {
            return NextResponse.json({ message: 'لقد قمت بالتقييم مسبقاً' }, { status: 400 });
        }

        // إضافة تقييم جديد
        const newRating = await prisma.rating.create({
            data: {
                roomId,
                userId,
                ratingValue: ratingValue,
            },
        });

        const writerComment = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { name: true } })
        const room = await prisma.room.findUnique({ where: { id: Number(roomId) }, select: { name: true } })
        const users = await prisma.user.findMany({
            where: {
                role: "SuperAdmin",
                id: { not: Number(userId) }
            },
            select: { id: true }
        })

        // Create all notifications at once
        const notifications = users.map(item => ({
            message: `${writerComment?.name} rated room (${room?.name}): ${ratingValue} ${ratingValue > 1 ? "stars" : "star"}`,
            userId: item.id,
            type: "rating",
            link: `/dashboard/rooms`
        }))

        await prisma.notification.createMany({ data: notifications })

        // Broadcast notifications
        for (const item of users) {
            const notification = await prisma.notification.findFirst({
                where: { userId: item.id },
                orderBy: { createdAt: 'desc' }
            })

            await supabase
                .channel(`notifications-${item.id}`)
                .send({
                    type: 'broadcast',
                    event: 'new-notification',
                    payload: notification,
                });
        }

        return NextResponse.json({ message: 'تم التقييم بنجاح', rating: newRating });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'حدث خطأ ما' }, { status: 500 });
    }
}
