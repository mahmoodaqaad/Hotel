import prisma from "@/utils/db"
import { varfiyToken } from "@/utils/verfiyToken"
import { NextRequest, NextResponse } from "next/server"

interface Props {
    params: Promise<{ id: string }>

}

export const GET = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const MyUser = varfiyToken(req)

        if (MyUser?.id !== id) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        const MyTodo = await prisma.todo.findMany({
            where: { userId: id as string },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!MyTodo) return NextResponse.json({ message: "Todo Not found" }, { status: 404 });

        return NextResponse.json(MyTodo, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }

}

export const PUT = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const MyUser = varfiyToken(req)

        const todo = await prisma.todo.findUnique({ where: { id: id as string } })
        if (!todo) return NextResponse.json({ message: "Not Found Todo" }, { status: 404 })

        if (MyUser?.id !== todo?.userId) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        await prisma.todo.update({
            where: { id: id as string },
            data: {
                status: todo?.status === "completed" ? "pending" : "completed"
            }
        })
        return NextResponse.json({ message: "Updated" }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "internal server error", error }, { status: 500 })
    }
}
export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const MyUser = varfiyToken(req)

        const todo = await prisma.todo.findUnique({ where: { id: id } })
        if (!todo) return NextResponse.json({ message: "Not Found Todo" }, { status: 404 })

        if (MyUser?.id !== todo?.userId) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }

        await prisma.todo.delete({ where: { id: id } })

        return NextResponse.json({ message: "Deleted Todo Successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }
}

