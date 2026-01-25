import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: id as string },
            select: {
                id: true,
                amount: true,
                method: true,
                status: true,
                userId: true,
                createdAt: true,
                booking: {
                    select: {
                        totalAmount: true
                    }
                }
            }
        })
        if (!payment) return NextResponse.json({ message: "Payment not found" }, { status: 404 })
        return NextResponse.json(payment, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "intrenal Server Error" }, { status: 500 })

    }

}


export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    try {
        const payment = await prisma.payment.findUnique({ where: { id: id as string } })
        if (!payment) return NextResponse.json({ message: "Payment not found" }, { status: 404 })
        const book = await prisma.booking.findUnique({ where: { id: payment.bookingId } })
        const body = await req.json()

        const currentPaymentAmount = Number(payment.amount)
        const currentBookingPaid = Number(book?.paidAmount)
        const totalBookingAmount = Number(book?.totalAmount)
        const newPaymentAmount = Number(body.amount)

        const newBookingPaid = currentBookingPaid - currentPaymentAmount + newPaymentAmount

        if (newBookingPaid > totalBookingAmount) {
            return NextResponse.json({ message: "The amount paid is greater than the total booking amount." }, { status: 400 })
        }

        const isPaid = newBookingPaid >= totalBookingAmount

        await prisma.payment.update({
            where: { id: id as string },
            data: {
                method: body.method,
                amount: newPaymentAmount,
                status: isPaid ? "paid" : "pending"
            }
        })

        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: {
                paidAmount: newBookingPaid,
                remainingAmount: totalBookingAmount - newBookingPaid,
                paymentStatus: isPaid ? "paid" : "pending"
            }
        })
        return NextResponse.json({ message: "updated" }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "intrenal Server Error" }, { status: 500 })

    }

}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    try {
        const payment = await prisma.payment.findUnique({ where: { id: id as string } })
        if (!payment) return NextResponse.json({ message: "Payment not found" }, { status: 404 })
        // const book = await prisma.booking.findUnique({ where: { id: Number(payment.bookingId) } })

        // const oldAmount = Number(book?.paidAmount)



        await prisma.payment.delete({ where: { id: id as string } })

        // await prisma.booking.update({
        //     where: { id: Number(payment.bookingId) },
        //     data: {
        //         paidAmount: oldAmount + Number(body.amount),
        //         remainingAmount: Number(book?.totalAmount) - (oldAmount + Number(body.amount)),
        //         paymentStatus: oldAmount + Number(body.amount) === Number(book?.totalAmount) ? "paid" : "pending"
        //     }

        // })
        return NextResponse.json({ message: "updated" }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "intrenal Server Error" }, { status: 500 })

    }

}

