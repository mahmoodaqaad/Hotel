import { IsSuperAdminOrAdmin } from "@/utils/CheckRole";
import prisma from "@/utils/db";
import { varfiyToken } from "@/utils/verfiyToken";
import { NextRequest, NextResponse } from "next/server";
interface Props {
    params: Promise<{ id: string }>
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const user = await varfiyToken(req)

        const isAllowd = IsSuperAdminOrAdmin(req)
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) }
        })
        if (!isAllowd && comment?.userId !== user?.id) {

            return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
        }


        if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });


        await prisma.comment.delete({ where: { id: Number(id) } })


        return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });

    } catch (error) {
        console.log("*******************");
        console.log(error);
        return NextResponse.json({ message: 'Error intrnel Server', error }, { status: 500 });

    }
}