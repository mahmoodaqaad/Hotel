import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import prisma from "@/utils/db";
import { CreateBookingRequestDto } from "@/utils/Dtos";
import { varfiyToken } from "@/utils/verfiyToken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";



export const GET = async (req: NextRequest) => {
    const isAllowd = IsSuperAdminOrAdminOrManager(req)

    if (!isAllowd) {

        return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
    } const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1
    const search = req.nextUrl.searchParams.get("search") || ""
    if (search) {
        const request = await prisma.bookingRequest.findMany({
            where: {
                OR: [
                    {
                        user: {
                            name: {

                                contains: search,
                                mode: "insensitive"
                            }
                        },
                    },
                    {
                        room: {
                            name: {

                                contains: search,
                                mode: "insensitive"
                            }
                        },
                    },

                ]
            },
            select: {
                checkIn: true,
                checkOut: true,
                id: true,
                createdAt: true,
                status: true,
                roomId: true,
                userId: true,
                room: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return NextResponse.json(request, { status: 200 })

    }
    const request = await prisma.bookingRequest.findMany({
        skip: ARTICLE_PER_PAGE * (Number(pageNumber) - 1),
        take: ARTICLE_PER_PAGE,
        select: {
            checkIn: true,
            checkOut: true,
            id: true,
            createdAt: true,
            status: true,
            roomId: true,
            userId: true,
            room: {
                select: {
                    name: true
                }
            },
            user: {
                select: {
                    name: true
                }
            }
        }
    })
    return NextResponse.json(request, { status: 200 })

}


export const POST = async (req: NextRequest) => {
    try {

        const ISuser = varfiyToken(req)
        if (!ISuser) {

            return NextResponse.json({ message: "your not allowd ,for bidena" }, { status: 403 })
        }
        const { userId, roomId, checkIn, checkOut }: CreateBookingRequestDto = await req.json();

        if (!userId) return NextResponse.json({ message: "userId not Found" }, { status: 404 })

        if (!roomId) return NextResponse.json({ message: "roomId not Found" }, { status: 404 })

        if (!checkIn) return NextResponse.json({ message: "checkIn not Found" }, { status: 404 })

        if (!checkOut) return NextResponse.json({ message: "checkOut not Found" }, { status: 404 })

        const checkInn = new Date(checkIn);
        const checkOutn = new Date(checkOut);
        const now = new Date();

        // Validate dates
        if (checkOutn.getTime() <= checkInn.getTime()) {
            return NextResponse.json({ message: "Check-out must be after check-in" }, { status: 400 })
        }

        // Check if dates are in the past
        if (checkInn < now) {
            return NextResponse.json({ message: "Check-in date cannot be in the past" }, { status: 400 })
        }

        // Verify user exists
        const IdUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!IdUser) return NextResponse.json({ message: "User not Found" }, { status: 404 })

        // Use transaction to prevent race conditions
        const result = await prisma.$transaction(async (tx) => {
            // Get room with lock (using findUnique inside transaction)
            const Room = await tx.room.findUnique({ where: { id: roomId } })

            if (!Room) {
                throw new Error("Room not Found")
            }

            // Check if room is available
            if (Room.status !== "available") {
                throw new Error(`Room is ${Room.status}`)
            }

            // Check for date overlaps with active bookings
            const overlappingBookings = await tx.booking.findFirst({
                where: {
                    roomId: roomId,
                    status: "active",
                    AND: [
                        { checkIn: { lte: checkOutn } },
                        { checkOut: { gte: checkInn } }
                    ]
                }
            })

            if (overlappingBookings) {
                throw new Error("Room is already booked for these dates")
            }

            // Check for overlapping pending requests
            const overlappingRequests = await tx.bookingRequest.findFirst({
                where: {
                    roomId: roomId,
                    status: "pending",
                    AND: [
                        { checkIn: { lte: checkOutn } },
                        { checkOut: { gte: checkInn } }
                    ]
                }
            })

            if (overlappingRequests) {
                throw new Error("There is already a pending request for these dates")
            }

            // Create booking request
            const newRequst = await tx.bookingRequest.create({
                data: {
                    userId: userId,
                    roomId: roomId,
                    checkIn: checkInn,
                    checkOut: checkOutn
                }
            })

            // Update room status
            await tx.room.update({
                where: { id: roomId },
                data: { status: "requested" }
            })

            return newRequst
        })

        // Send notifications after successful transaction
        const writerComment = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
        const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } })
        const users = await prisma.user.findMany({
            where: {
                role: "SuperAdmin",
                id: { not: userId }
            },
            select: { id: true }
        })

        // Create all notifications at once
        const notifications = users.map(item => ({
            message: `${writerComment?.name} request book for a room (${room?.name})`,
            userId: item.id,
            type: "booking-request",
            link: `/dashboard/booking-requests`
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

        return NextResponse.json({ message: "add requst", newRequst: result }, { status: 201 })

    } catch (error) {
        console.log("****************");
        console.log(error);

        if (error instanceof Error) {
            if (error.message === "Room not Found") {
                return NextResponse.json({ message: error.message }, { status: 404 })
            }
            if (error.message.includes("booked") || error.message.includes("requested") || error.message.includes("pending")) {
                return NextResponse.json({ message: error.message }, { status: 400 })
            }
        }

        return NextResponse.json({ message: "Error in internal Server", error }, { status: 500 })
    }

}
