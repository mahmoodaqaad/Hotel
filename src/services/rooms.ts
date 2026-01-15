import prisma from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import { Prisma, RoomStatus } from "@prisma/client";
import { serializePrisma } from "@/utils/serialize";

// Types for params to avoid 'any'
interface GetRoomsParams {
    pageNumber?: string | number;
    search?: string;
    // Allow undefined or string, but we will sanitize inside
    sort?: string;
    order?: string;
    filter?: string;
    limit?: number;
}

export const getAllRooms = async (params: GetRoomsParams = {}) => {
    const {
        pageNumber = 1,
        search = "",
        limit = ARTICLE_PER_PAGE
    } = params;

    // Sanitize sort and order to ensure valid Prisma inputs
    // If param is "", fallback to default
    const sort = params.sort || "createdAt";
    const order = (params.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
    const filter = params.filter || "";

    const take = Number(limit) || ARTICLE_PER_PAGE;
    const skip = (Number(pageNumber) - 1) * take;

    const where: Prisma.RoomWhereInput = {};

    // 1. Unified Search Filter
    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive"
        };
    }

    // 2. Status Filter
    if (filter) {
        where.status = filter as RoomStatus;
    }

    try {
        const rooms = await prisma.room.findMany({
            where,
            orderBy: {
                [sort]: order
            },
            skip,
            take,
            include: {
                images: true
            }
        });
        return serializePrisma(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
}

export const getRoomsCount = async () => {
    return prisma.room.count();
}

export const getSingleRoom = async (id: string | number) => {
    try {
        const room = await prisma.room.findUnique({
            where: { id: Number(id) },
            include: {

                images: true,
                Rating: true,
                bookingRequests: {
                    where: {
                        status: "pending" // Only include active/pending booking requests
                    },
                    select: {
                        userId: true,
                        roomId: true,
                        id: true,
                        status: true
                    }
                },
                bookings: {
                    where: {
                        status: "active" // Only include active bookings
                    },
                    select: {
                        userId: true,
                        roomId: true,
                        id: true,
                        status: true,
                        checkIn: true,
                        checkOut: true
                    }
                },



                comments: {
                    include: { user: true }
                }
            }
        });

        if (!room) return null;

        const ratings = room.Rating;
        const totalRatings = ratings.length;
        const totalStars = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
        const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

        return serializePrisma({
            ...room,
            averageRating: Number(averageRating.toFixed(1)),
            totalRatings
        });
    } catch (error) {
        console.error("Error fetching room:", error);
        return null;
    }
}

export const searchRooms = async (search: string) => {
    if (!search) return [];

    const rooms = await prisma.room.findMany({
        include: {
            images: true
        },
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { guest: { contains: search, mode: "insensitive" } },
                { view: { contains: search, mode: "insensitive" } }
            ]
        }
    })
    return serializePrisma(rooms);
}

interface FilterRoomsParams {
    checkIn?: string;
    checkOut?: string;
    guest?: string;
    type?: string;
}

export const getFilteredRooms = async (params: FilterRoomsParams) => {
    const { checkIn, checkOut, guest, type } = params;

    // If essential params are missing, maybe return empty or all? 
    // The original API implies all are expected, but let's handle gracefully.
    if (!checkIn || !checkOut) return [];

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    try {
        const rooms = await prisma.room.findMany({
            where: {
                // If type is "Any Room" or empty, ignore it? The API exact matched it.
                // Looking at page.tsx: <span ...>{type || 'Any Room'}</span>.
                // But normally specific type is sent. If type is empty string, prisma might find nothing if db has types.
                // Let's assume strict match if provided.
                ...(type && { roomType: type as any }),
                ...(guest && { guest: guest }),
                OR: [
                    {
                        status: {
                            in: ["available", "requested"]
                        }
                    },
                    {
                        status: "booked",
                        bookings: {
                            none: {
                                AND: [
                                    { checkIn: { lte: checkOutDate } },
                                    { checkOut: { gte: checkInDate } }
                                ]
                            }
                        }

                    }
                ]
            },
            include: {
                images: true
            }
        });
        return rooms;
    } catch (error) {
        console.error("Error filtering rooms:", error);
        return [];
    }
}
