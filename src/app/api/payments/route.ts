import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import prisma from "@/utils/db";
import { NextRequest, NextResponse, NextResponse as res } from "next/server";

export const GET = async (req: NextRequest) => {


    try {

        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1
        const search = req.nextUrl.searchParams.get("search") || ""

        if (search) {
            const request = await prisma.payment.findMany({
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
                            booking: {
                                room: {

                                    name: {

                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                        },

                    ]
                },
                select: {
                    amount: true,
                    id: true,
                    method: true,
                    status: true,
                    createdAt: true,
                    userId: true,
                    bookingId: true,
                    user: {
                        select: { name: true }
                    },
                    booking: {
                        select: {
                            totalAmount: true,
                            room: {
                                select:
                                    { name: true }
                            }
                        }
                    }
                }
            })
            return NextResponse.json(request, { status: 200 })

        }
        const payment = await prisma.payment.findMany({
            skip: ARTICLE_PER_PAGE * (Number(pageNumber) - 1),
            take: ARTICLE_PER_PAGE,
            select: {
                amount: true,
                id: true,
                method: true,
                status: true,
                createdAt: true,
                userId: true,
                bookingId: true,
                user: {
                    select: { name: true }
                },
                booking: {
                    select: {
                        totalAmount: true,
                        room: {
                            select:
                                { name: true }
                        }
                    }
                }
            }
        })

        return res.json(payment, { status: 200 })

    } catch (error) {
        return res.json({ message: "intrnal server Error", error }, { status: 500 })
    }
}


export const POST = async (req: NextRequest) => {

    try {
        const isAllowd = IsSuperAdminOrAdminOrManager(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }
        const body = await req.json()
        const { method, amount, userId, roomId, bookId } = body

        // Validate amount is positive
        if (!amount || Number(amount) <= 0) {
            return NextResponse.json({
                message: "Payment amount must be positive"
            }, { status: 400 })
        }

        const book = await prisma.booking.findUnique({ where: { id: bookId } })
        const user = await prisma.user.findUnique({ where: { id: userId } })
        const room = await prisma.room.findUnique({ where: { id: roomId } })

        if (!book) return NextResponse.json({ message: "booked not Found" }, { status: 404 })
        if (!room) return NextResponse.json({ message: "room not Found" }, { status: 404 })
        if (!user) return NextResponse.json({ message: "user not Found" }, { status: 404 })

        if (book.paidAmount === book.totalAmount) return NextResponse.json({ message: "Payment has been made in full" }, { status: 400 })

        // Check if amount exceeds remaining balance
        if (Number(amount) > Number(book.remainingAmount)) {
            return NextResponse.json({
                message: "Amount exceeds remaining balance",
                remainingAmount: book.remainingAmount
            }, { status: 400 })
        }

        if (Number(book.paidAmount) + Number(amount) > Number(book.totalAmount)) return NextResponse.json({ message: "The amount paid is greater than the requested amount.", method, userId, roomId, amount, book, room }, { status: 400 })

        await prisma.payment.create({
            data: {

                userId: userId,
                bookingId: bookId,
                amount: Number(amount),
                method: method,
                // status: (Number(book.paidAmount) + Number(amount)) === Number(room.price) ? "paid" : "pending",


            }
        })

        await prisma.booking.update({
            where: { id: bookId }
            , data: {
                paidAmount: Number(book.paidAmount) + Number(amount),
                remainingAmount: Number(book.totalAmount) - (Number(book.paidAmount) + Number(amount)),
                paymentStatus: Number(book.paidAmount) + Number(amount) === Number(room.price) ? "paid" : "pending"
            }
        })
        return NextResponse.json({ message: "new payments added" }, { status: 201 })
    } catch (error) {

        console.log(error);

        return NextResponse.json({ message: "internal server Error" }, { status: 500 })

    }


}