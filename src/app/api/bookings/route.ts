import { BookingState } from "@prisma/client";
import { IsSuperAdminOrAdminOrManager } from "@/utils/CheckRole";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import prisma from "@/utils/db";
import { CreateBooking } from "@/utils/Dtos";
import { CreateBookingSchema } from "@/utils/schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

  try {
    const isAllowd = IsSuperAdminOrAdminOrManager(req)

    if (!isAllowd) {

      return NextResponse.json({ message: "your not allowd ,for biden", isAllowd }, { status: 403 })
    }

    const pageNumber = Number(req.nextUrl.searchParams.get("pageNumber")) > 0 ? req.nextUrl.searchParams.get("pageNumber") : 1
    const search = req.nextUrl.searchParams.get("search") || ""
    const sort = req.nextUrl.searchParams.get("sort") || "createdAt"
    const order = req.nextUrl.searchParams.get("order") === "asc" ? "asc" : "desc"
    const filter = req.nextUrl.searchParams.get("filter") || ""

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { room: { name: { contains: search, mode: "insensitive" } } },
      ]
    }
    if (filter) {
      whereClause.status = filter as BookingState
    }

    if (search) {
      const booking = await prisma.booking.findMany({
        orderBy: {
          [sort]: order
        },
        where: whereClause,
        select: {

          room: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true
            }
          },
          checkIn: true,
          checkOut: true,
          createdAt: true,
          paymentStatus: true,
          roomId: true,
          userId: true,
          id: true,
          payment: true,
          status: true,
          totalAmount: true,
          paidAmount: true,

          remainingAmount: true
        }
      })
      return NextResponse.json(booking, { status: 200 })

    }

    const Booking = await prisma.booking.findMany({
      skip: ARTICLE_PER_PAGE * (Number(pageNumber) - 1),
      take: ARTICLE_PER_PAGE,
      orderBy: {
        [sort]: order
      },
      where: filter ? { status: filter as BookingState } : {},
      select: {

        room: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true
          }
        },
        checkIn: true,
        checkOut: true,
        createdAt: true,
        paymentStatus: true,
        roomId: true,
        userId: true,
        id: true,
        payment: true,
        status: true,
        totalAmount: true,
        paidAmount: true,

        remainingAmount: true
      }

    })

    return NextResponse.json(Booking, { status: 200 })


  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "internal server error", error }, { status: 500 })

  }
}

export const POST = async (req: NextRequest) => {

  try {
    const isAllowd = IsSuperAdminOrAdminOrManager(req)

    if (!isAllowd) {

      return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
    }

    const body = (await req.json()) as CreateBooking

    const val = CreateBookingSchema.safeParse(body)
    if (!val.success) return NextResponse.json({ message: val.error.errors[0].message }, { status: 400 })
    const { amount, checkIn, checkOut, method, roomId, userId } = body

    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } })
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
    if (!user) return NextResponse.json({ message: "No user has this ID" }, { status: 400 })
    if (!room) return NextResponse.json({ message: "No Room has this ID" }, { status: 400 })
    if (room?.status == "booked") return NextResponse.json({ message: "this room is booked" }, { status: 400 })


    if (!checkIn) return NextResponse.json({ message: "checkIn not Found" }, { status: 404 })

    if (!checkOut) return NextResponse.json({ message: "checkOut not Found" }, { status: 404 })
    if (Number(new Date(checkOut).getTime()) - Number(Number(new Date(checkIn).getTime())) <= 0) return NextResponse.json({ message: "check in is after check out" }, { status: 404 })
    if (+Number(room.price) < Number(amount)) return NextResponse.json({ message: "this amount is biiger for the room price" }, { status: 400 })
    const createBooking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        roomId: Number(roomId),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalAmount: Number(room?.price),
        paidAmount: Number(amount),
        remainingAmount: (Number(room?.price) - Number(amount)),
        paymentStatus: Number(amount) === Number(room?.price) ? "paid" : "pending"

      }

    })


    await prisma.room.update({
      where: { id: Number(roomId) },
      data: {
        status: "booked"

      }
    })

    await prisma.payment.create({
      data: {
        userId: Number(userId),
        bookingId: createBooking.id,
        amount: Number(amount),
        method,
        status: Number(amount) === Number(room?.price) ? "paid" : "pending"
      }
    })
    return NextResponse.json({ message: "created booked" }, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "500 intrenal error" }, { status: 500 })

  }

}