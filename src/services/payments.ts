
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma, PaymentStatus } from "@prisma/client";
import { serializePrisma } from "@/utils/serialize";

interface GetPaymentsParams {
    pageNumber?: string | number;
    search?: string;
    sort?: string;
    order?: string;
    filter?: string;
}

export const getAllPayments = async (params: GetPaymentsParams = {}) => {
    const {
        pageNumber = 1,
        search = "",
    } = params;

    const sort = params.sort || "createdAt";
    const order = (params.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
    const filter = params.filter || "";


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

    if (filter) {
        where.status = filter as PaymentStatus;
    }

    try {
        const payments = await prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy: { [sort]: order },
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
        return serializePrisma(payments);
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
            where: { id: id },
            include: {
                booking: true
            }
        });
        return serializePrisma(payment);
    } catch (error) {
        console.error("Error fetching single payment:", error);
        return null;
    }
}
