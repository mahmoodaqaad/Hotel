
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";

import { serializePrisma } from "@/utils/serialize";
import { BookingStatus, Prisma } from "@prisma/client";

interface GetRequestsParams {
    pageNumber?: string | number;
    search?: string;
    sort?: string;
    order?: string;
    filter?: string;
}

export const getAllBookingRequests = async (params: GetRequestsParams = {}) => {
    const {
        pageNumber = 1,
    } = params;

    const sort = params.sort || "createdAt";
    const order = (params.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
    const filter = params.filter || "";

    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    const where: Prisma.BookingRequestWhereInput = {};

    if (filter) {
        where.status = filter as BookingStatus;
    }

    try {
        const requests = await prisma.bookingRequest.findMany({
            where,
            skip,
            take,
            orderBy: { [sort]: order },
            include: {
                user: { select: { name: true, email: true } },
                room: { select: { name: true, price: true } }
            }
        });
        return serializePrisma(requests);
    } catch (error) {
        console.error("Error fetching booking requests:", error);
        return [];
    }
}

export const getBookingRequestsCount = async () => {
    return prisma.bookingRequest.count();
}
