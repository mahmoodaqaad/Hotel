import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma, BookingState } from "@prisma/client";
import { serializePrisma } from "@/utils/serialize";

// Types for params
interface GetBookingsParams {
    pageNumber?: string | number;
    search?: string;
    sort?: string;
    order?: string;
    filter?: string;
}

export const getAllBookings = async (params: GetBookingsParams = {}) => {
    const {
        pageNumber = 1,
        search = "",
    } = params;

    const sort = params.sort || "createdAt";
    const order = (params.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
    const filter = params.filter || "";


    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    // Booking sort order defaulting to newest first
    const orderBy: Prisma.BookingOrderByWithRelationInput = { [sort]: order };

    const where: Prisma.BookingWhereInput = {};

    if (search) {
        where.OR = [
            {
                room: {
                    name: { contains: search, mode: 'insensitive' }
                }
            },
            {
                user: {
                    name: { contains: search, mode: 'insensitive' }
                }
            }
        ];
    }

    if (filter) {
        where.status = filter as BookingState;
    }

    try {
        const bookings = await prisma.booking.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                user: { select: { name: true, email: true } },
                room: { select: { name: true, price: true } }
            }
        });
        return serializePrisma(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export const getBookingsCount = async () => {
    return prisma.booking.count();
}

export const getSingleBooking = async (id: string | number) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                room: { select: { id: true, name: true, price: true, images: { take: 1 } } },
                payment: true,
            }
        });
        return serializePrisma(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        return null;
    }
}
