import { IsSuperAdmin } from "@/utils/CheckRole";
import { ARTICLE_PER_PAGE } from "@/utils/consant";
import prisma from "@/utils/db";
import { addUserDto } from "@/utils/Dtos";
import { RegisterSchema } from "@/utils/schema";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const isAllowd = IsSuperAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 })
        }
        const pageNumber = Number(req.nextUrl.searchParams.get("pageNumber")) > 0 ? req.nextUrl.searchParams.get("pageNumber") : 1
        const search = req.nextUrl.searchParams.get("search") || ""
        const sort = req.nextUrl.searchParams.get("sort") || "createdAt"
        const order = req.nextUrl.searchParams.get("order") === "asc" ? "asc" : "desc"
        const filter = req.nextUrl.searchParams.get("filter") || ""

        const whereClause: any = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        }

        if (filter) {
            whereClause.role = filter
        }

        if (search) {
            const users = await prisma.user.findMany({
                where: whereClause,
                orderBy: {
                    [sort]: order
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,

                }
            })
            return NextResponse.json(users, { status: 200 })

        }
        const users = await prisma.user.findMany({
            where: filter ? { role: filter as Role } : {},
            orderBy: {
                [sort]: order
            },
            skip: ARTICLE_PER_PAGE * (Number(pageNumber) - 1),
            take: ARTICLE_PER_PAGE,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                role: true,

            }
        })

        return NextResponse.json(users, { status: 200 })
    } catch {
        return NextResponse.json({ message: "internal server Error" }, { status: 500 })
    }

}
export const POST = async (req: NextRequest) => {
    try {

        const body = (await req.json()) as addUserDto

        const isAllowd = IsSuperAdmin(req)

        if (!isAllowd) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }


        const valdtionUser = RegisterSchema.safeParse(body)
        if (!valdtionUser.success) {
            return NextResponse.json({ message: valdtionUser.error.errors[0].message }, { status: 400 })

        }

        const allowedEmail = await prisma.user.findUnique({ where: { email: body.email } })

        if (allowedEmail) {

            return NextResponse.json({ message: "email is aready exist" }, { status: 400 })

        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(body.password as string, salt)
        await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashPassword,
                role: body.role as Role,
            }
        })

        return NextResponse.json({ message: "add user" }, { status: 200 })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "500 intrenal error" }, { status: 500 })

    }


}