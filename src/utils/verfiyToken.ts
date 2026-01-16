import jwt from 'jsonwebtoken';
import { JWTPaylod } from "./Types";
import { NextRequest } from 'next/server';
import prisma from "@/utils/db";
import { serializePrisma } from './serialize';

// Types for router compatibility
interface NextApiRequestLike {
    cookies: Partial<{ [key: string]: string }>;
}

export function varfiyToken(req: NextRequest | NextApiRequestLike): JWTPaylod | null {
    try {
        let jwtToken: string | undefined;

        if ('cookies' in req) {
            if (typeof req.cookies.get === 'function') {
                // NextRequest (App Router)
                jwtToken = (req as NextRequest).cookies.get("jwt")?.value;
            } else {
                // NextApiRequest (Pages Router) or Express
                jwtToken = (req as NextApiRequestLike).cookies['jwt'];
            }
        }

        if (!jwtToken) return null;

        const privateKey = process.env.JWT_SECRET_KEY as string;
        return jwt.verify(jwtToken, privateKey) as JWTPaylod;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function varfiyTokenForPage() {
    try {
        let token = "";
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("jwt")?.value || "";
        } catch {
            console.warn("varfiyTokenForPage called outside App Router context");
            return null;
        }

        if (!token) return null;
        const privtKey = process.env.JWT_SECRET_KEY as string;

        // Prevent jwt.verify from throwing if token is invalid format or empty
        try {
            const userPayload = jwt.verify(token, privtKey) as JWTPaylod;
            return userPayload || null;
        } catch {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function varfiyMyAccount(includeRelations: boolean = false) {
    try {
        let token = "";
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("jwt")?.value || "";
        } catch {
            console.warn("varfiyMyAccount called outside App Router context");
            return null;
        }

        if (!token) return null;
        const privtKey = process.env.JWT_SECRET_KEY as string;
        let userPayload: JWTPaylod;
        try {
            userPayload = jwt.verify(token, privtKey) as JWTPaylod;
        } catch {
            return null;
        }

        // Direct DB access instead of fetch to avoid network loop errors
        let user;
        if (includeRelations) {
            user = await prisma.user.findUnique({
                where: { id: userPayload?.id },
                include: {
                    bookings: {
                        include: {
                            room: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    bookingRequests: {
                        include: {
                            room: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    comments: {
                        include: {
                            room: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    Saved: {
                        include: {
                            room: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    Notification: true
                }
            });
        } else {
            user = await prisma.user.findUnique({
                where: { id: userPayload.id },
                select: { id: true, name: true, email: true, role: true, createdAt: true, Notification: true },
            });
        }

        if (!user) return null;
        return serializePrisma(user);

    } catch (error) {
        console.log(error);
        return null;
    }
}
