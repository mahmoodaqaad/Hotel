
import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma } from "@prisma/client";

// Types for params to avoid 'any'
interface GetUsersParams {
    pageNumber?: string | number;
    search?: string;
    sort?: string;
    order?: string;
    filter?: string;
}

export const getAllUsers = async (params: GetUsersParams = {}) => {
    const {
        pageNumber = 1,
        search = "",
    } = params;

    // Sanitize sort and order to ensure valid Prisma inputs
    const sort = params.sort || "createdAt";
    const order = (params.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
    // user filter logic is not strictly defined in schema like RoomStatus, defaulting to simple role filter if needed
    // Assuming filter might be role or generic status. For now adhering to search.

    const take = ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    const where: Prisma.UserWhereInput = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
        ];
    }

    if (params.filter) {
        // Safe casting if filter matches Role enum, otherwise ignore or handle specifically
        // where.role = params.filter as Role; 
    }

    try {
        const users = await prisma.user.findMany({
            where,
            orderBy: {
                [sort]: order
            },
            skip,
            take,
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export const getUsersCount = async () => {
    return prisma.user.count();
}

export const getSingleUser = async (id: string | number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
