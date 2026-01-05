import jwt from 'jsonwebtoken';
import { JWTPaylod } from "./Types";
import { NextRequest } from 'next/server';
import { getFetchById } from './FetchData';

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
        } catch (e) {
            console.warn("varfiyTokenForPage called outside App Router context");
            return null;
        }

        if (!token) return null;
        const privtKey = process.env.JWT_SECRET_KEY as string;
        const userPayload = jwt.verify(token, privtKey) as JWTPaylod;
        return userPayload || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function varfiyMyAccount() {
    try {
        let token = "";
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("jwt")?.value || "";
        } catch (e) {
            console.warn("varfiyMyAccount called outside App Router context");
            return null;
        }

        if (!token) return null;
        const privtKey = process.env.JWT_SECRET_KEY as string;
        const userPayload = jwt.verify(token, privtKey) as JWTPaylod;

        // This implicitly uses token in FetchData via dynamic import too
        const response = await getFetchById("users/myAccount", userPayload.id)

        if (response.status === 403) {
            try {
                const { redirect } = await import("next/navigation");
                redirect("/dashboard/403");
            } catch (e) {
                // Handle redirect manually or return generic error if in Pages/API
                return { error: 'Forbidden' };
            }
        }

        if (!response.ok) throw new Error("Error IN Your account")

        return response.json()

    } catch (error) {
        console.log(error);
        return null;
    }
}
