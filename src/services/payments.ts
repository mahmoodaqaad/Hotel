
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma } from "@prisma/client";

interface GetPaymentsParams {
    pageNumber?: string | number;
    search?: string;
}

export const getAllPayments = async (params: GetPaymentsParams = {}) => {
    const {
        pageNumber = 1,
        search = "",
    } = params;

    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    const where: Prisma.PaymentWhereInput = {};

    if (search) {
        // Assuming search matches user name or email related to payment
        where.user = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        };
    }

    try {
        const payments = await prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                booking: {
                    include: {
                        room: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        return payments;
    } catch (error) {
        console.error("Error fetching payments:", error);
        return [];
    }
}

export const getPaymentsCount = async () => {
    return prisma.payment.count();
}

export const getSinglePayment = async (id: string | number) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: Number(id) },
            include: {
                booking: true
            }
        });
        return payment;
    } catch (error) {
        console.error("Error fetching single payment:", error);
        return null;
    }
}
