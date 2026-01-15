
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma } from "@prisma/client";
import { serializePrisma } from "@/utils/serialize";

interface GetRequestsParams {
    pageNumber?: string | number;
}

export const getAllBookingRequests = async (params: GetRequestsParams = {}) => {
    const {
        pageNumber = 1,
    } = params;

    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    try {
        const requests = await prisma.bookingRequest.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
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
