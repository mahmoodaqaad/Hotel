// تغغير ل مكتمل او الغاء

import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { varfiyToken } from "@/utils/verfiyToken";

interface Props {
    params: Promise<{ id: string }>
}

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {

    try {
        const { id } = await context.params;
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        // find booking

        const booking = await prisma.booking.findUnique({ where: { id: Number(id) } })

        if (!booking) return NextResponse.json({ message: "book is not found" }, { status: 404 })

        if (booking.status !== "active") return NextResponse.json({ message: "you can not update status for this room" }, { status: 400 })

        await prisma.booking.update({
            where: { id: Number(id) },
            data: { status: "completed" }
        })
        await prisma.room.update({
            where: { id: Number(booking.roomId) },
            data: { status: "available" }
        })


        const room = await prisma.room.findUnique({ where: { id: Number(booking.roomId) }, select: { name: true } })


        const notification = await prisma.notification.create({
            data: {
                message: `your booking is complete for room ${room?.name}`,
                userId: booking.userId,
                type: "booking complete",
                link: "/profile/bookings"
            }
        });

        // Broadcast via Supabase
        await supabase
            .channel(`notifications-${booking.userId}`)
            .send({
                type: 'broadcast',
                event: 'new-notification',
                payload: notification,
            });

        return NextResponse.json({ message: "Completed " }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server Error", error }, { status: 500 })

    }

}

export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;

    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        const user = varfiyToken(req)

        // If not admin and no valid user token, deny access
        if (!isAllowd && !user) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 })
        }

        // find booking
        const booking = await prisma.booking.findUnique({ where: { id: Number(id) } })

        if (!booking) return NextResponse.json({ message: "book is not found" }, { status: 404 })

        // Allow if admin/manager OR if user owns the booking
        if (!isAllowd && Number(user?.id) !== Number(booking.userId)) {
            return NextResponse.json({ message: "Not allowed" }, { status: 403 })
        }

        if (booking.status !== "active") return NextResponse.json({ message: "you can not update status for this room" }, { status: 400 })

        await prisma.booking.update({
            where: { id: Number(id) },
            data: { status: "canceled" }
        })
        await prisma.room.update({
            where: { id: Number(booking.roomId) },
            data: { status: "available" }
        })

        const room = await prisma.room.findUnique({ where: { id: Number(booking.roomId) }, select: { name: true } })


        // Only notify the user if the action was performed by someone else (e.g., an Admin)
        if (Number(user?.id) !== Number(booking.userId)) {
            const notification = await prisma.notification.create({
                data: {
                    message: `your booking is Canceled for room ${room?.name}`,
                    userId: booking.userId,
                    type: "booking canceled",
                    link: "/room/" + booking.roomId
                }
            });

            // Broadcast via Supabase
            await supabase
                .channel(`notifications-${booking.userId}`)
                .send({
                    type: 'broadcast',
                    event: 'new-notification',
                    payload: notification,
                });
        }

        return NextResponse.json({ message: "Canceled " }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server Error", error }, { status: 500 })

    }
}