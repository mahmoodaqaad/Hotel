
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma } from "@prisma/client";

// Types for params
interface GetBookingsParams {
    pageNumber?: string | number;
    search?: string;
    // sort/order/filter can be added as needed
}

export const getAllBookings = async (params: GetBookingsParams = {}) => {
    const {
        pageNumber = 1,
    } = params;

    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    // Booking sort order defaulting to newest first
    const orderBy: Prisma.BookingOrderByWithRelationInput = { createdAt: 'desc' };

    try {
        const bookings = await prisma.booking.findMany({
            skip,
            take,
            orderBy,
            include: {
                user: { select: { name: true, email: true } },
                room: { select: { name: true, price: true } }
            }
        });
        return bookings;
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
        return booking;
    } catch (error) {
        console.error("Error fetching booking:", error);
        return null;
    }
}
