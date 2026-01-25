import prisma from "@/utils/db"
import { SavedDto } from "@/utils/Dtos"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {

    try {

        const { roomId, userId } = await req.json() as SavedDto

        if (!userId) return NextResponse.json({ message: "userId not Found" }, { status: 404 })

        if (!roomId) return NextResponse.json({ message: "roomId not Found" }, { status: 404 })

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) return NextResponse.json({ message: "userId not Found" }, { status: 404 })

        const Room = await prisma.room.findUnique({
            where: { id: roomId }, include: {
                Saved: true
            }
        })

        if (!Room) return NextResponse.json({ message: "roomId not Found" }, { status: 404 })
        const ISsaved = Room.Saved.find(item => item.roomId === roomId && item.userId === userId)
        if (ISsaved) {
            await prisma.saved.delete({ where: { id: ISsaved.id } })
            return NextResponse.json({ message: "Not Saved" }, { status: 200 })
        }

        await prisma.saved.create({
            data: {
                roomId,
                userId
            }
        })
        return NextResponse.json({ message: "Saved Room Successfully" }, { status: 200 })



    } catch (error) {
        NextResponse.json({ message: "", error }, { status: 500 })
    }
}