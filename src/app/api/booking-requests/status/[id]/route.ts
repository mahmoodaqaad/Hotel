import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import prisma from "@/utils/db";
import { varfiyToken } from "@/utils/verfiyToken";
import { NextRequest, NextResponse } from "next/server"

interface Props {
    params: { id: string }
}

export const PUT = async (req: NextRequest, { params: { id } }: Props) => {
    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)
        const user = varfiyToken(req)
        if (!isAllowd) {
            return NextResponse.json({ message: "Not allowed" }, { status: 403 })
        }

        const request = await prisma.bookingRequest.findUnique({
            where: { id: Number(id) }
        })
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const room = await prisma.room.findUnique({ where: { id: Number(request.roomId) } })

        const Newbook = await prisma.booking.create({
            data: {
                userId: request.userId,
                roomId: request.roomId,
                checkIn: request.checkIn,
                checkOut: request.checkOut,
                totalAmount: Number(room?.price),
                remainingAmount: room?.price
            }
        })

        await prisma.payment.create({
            data: {
                userId: request.userId,
                bookingId: Newbook.id,
                amount: 0,
                method: "null",
            }
        })

        await prisma.bookingRequest.update({
            where: { id: Number(id) },
            data: { status: "approved" }
        })

        await prisma.room.update({
            where: { id: Number(request.roomId) },
            data: { status: "booked" }
        })

        if (Number(user?.id) !== Number(request.userId)) {
            await prisma.notification.create({
                data: {
                    message: "Your booking request has been approved!",
                    userId: request.userId,
                    type: "booking-request",
                    link: "profile/requests" // Link to user's requests page
                }
            });
        }

        return NextResponse.json({ message: 'Booking confirmed successfully' }, { status: 200 });
    } catch (error) {
        console.error("Booking approval error:", error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, { params: { id } }: Props) => {
    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        const user = varfiyToken(req)
        const request = await prisma.bookingRequest.findUnique({
            where: { id: Number(id) }
        })
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (!isAllowd && Number(user?.id) != Number(request.userId)) {
            return NextResponse.json({ message: "Not allowed" }, { status: 403 })
        }



        await prisma.bookingRequest.update({
            where: { id: Number(id) },
            data: { status: "rejected" }
        })

        await prisma.room.update({
            where: { id: Number(request.roomId) },
            data: { status: "available" }
        })

        if (Number(user?.id) !== Number(request.userId)) {
            await prisma.notification.create({
                data: {
                    message: "Sorry, your booking request was rejected. Please contact us for details.",
                    userId: request.userId,
                    type: "booking-request",
                    link: "profile/requests"
                }
            })
        }

        return NextResponse.json({ message: 'Booking request rejected' }, { status: 200 });
    } catch (error) {
        console.error("Booking rejection error:", error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params: { id } }: Props) => {
    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        const user = varfiyToken(req)

        // If not admin and no valid user token, deny access
        if (!isAllowd && !user) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 })
        }

        const request = await prisma.bookingRequest.findUnique({
            where: { id: Number(id) }
        })
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Allow if admin/manager OR if user owns the booking request
        if (!isAllowd && Number(user?.id) !== Number(request.userId)) {
            return NextResponse.json({ message: "Not allowed" }, { status: 403 })
        }

        await prisma.bookingRequest.update({
            where: { id: Number(id) },
            data: { status: "rejected" }
        })

        await prisma.room.update({
            where: { id: Number(request.roomId) },
            data: { status: "available" }
        })

        return NextResponse.json({ message: 'Booking request cancelled' }, { status: 200 });
    } catch (error) {
        console.error("Booking cancellation error:", error);
        return NextResponse.json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}