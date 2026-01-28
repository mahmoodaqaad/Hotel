import jwt from 'jsonwebtoken';
import { JWTPaylod } from './Types';
import { serialize } from 'cookie';

export function generateToken(jwtPaylod: JWTPaylod): string {
    const privateKey = process.env.JWT_SECRET_KEY as string;
    if (!jwtPaylod) {
        console.error("generateToken Error: jwtPaylod is null or undefined!");
    }
    console.log("generateToken payload:", jwtPaylod);
    return jwt.sign(jwtPaylod, privateKey, { expiresIn: "90d" })

}

// set cookie with jwt 
export function setCookie(jwtPaylod: JWTPaylod): string {
    const token = generateToken(jwtPaylod)

    const cookie = serialize("jwt", token, {
        httpOnly: true,
        // secure:false ,    //=>http || true => https
        secure: process.env.NODE_ENV === "production",// development = http , production=https
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 90//90 day
    })
    return cookie
}