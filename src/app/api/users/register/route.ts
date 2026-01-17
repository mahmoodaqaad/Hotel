import prisma from "@/utils/db";
import { RegsiterDto } from "@/utils/Dtos";
import { setCookie } from "@/utils/generateToken";
import { RegisterSchema } from "@/utils/schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as RegsiterDto

        const validation = RegisterSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
        }

        const { email, name, password } = validation.data;
        console.log("Validation passed:", { email, name });

        if (!process.env.JWT_SECRET_KEY) {
            console.error("JWT_SECRET_KEY is missing!");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        console.log("Checking if user exists (count)...");
        console.log("Prisma instance:", !!prisma);

        let userCount = 0;
        try {
            // Using count is lighter and might bypass complex object mapping issues if any
            userCount = await prisma.user.count({ where: { email } });
            console.log("User count result:", userCount);
        } catch (dbError) {
            console.error("DB Error during count:", dbError);
            throw dbError;
        }

        if (userCount > 0) {
            return NextResponse.json({ message: "this user already Registered" }, { status: 400 })
        }

        console.log("Generating salt...");
        const salt = await bcrypt.genSalt(10)
        console.log("Hashing password...");
        const hashPassword = await bcrypt.hash(password, salt)

        console.log("Creating user...");
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword,
                role: "User" // Default role
            }, select: {
                id: true,
                name: true,
                role: true,
                email: true

            }

        })
        console.log("User created:", newUser);

        console.log("Setting cookie with payload:", {
            id: newUser.id,
            name: newUser.name,
            role: newUser?.role,
            email: newUser?.email
        });

        const cookie = setCookie({
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email
        })
        console.log("Cookie set successfully.");
        return NextResponse.json({ ...newUser, message: "Registered" }, {
            status: 201, headers: { "set-Cookie": cookie }
        })




    } catch (error) {
        console.log("Register API Error:", error);
        return NextResponse.json(
            { message: "internal server error", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }


}