import prisma from "@/utils/db";
import { varfiyToken } from "@/utils/verfiyToken";
import { NextRequest, NextResponse } from "next/server"
interface Props {
    params: Promise<{ id: string }>

}

// export const PUT = async (req: NextRequest, { params: { id } }: Props) => {

//     try {
// const isAllowd = IsSuperAdminOrAdminOrManager(req)

// if (!isAllowd) {

//     return NextResponse.json({ message: "your not allowd ,for biden" }, { status: 403 })
// }
//         const request = await prisma.bookingRequest.findUnique({
//             where: { id: id }
//         })
//         if (!request) {
//             return NextResponse.json({ error: 'Request not found' }, { status: 404 });
//         }

//         const body = await (req.json())



//         return NextResponse.json({ message: 'Booking confirmed successfully' }, { status: 200 });

//     } catch (error) {
//         console.log("*******************");
//         console.log(error);
//         return NextResponse.json({ message: 'Error intrnel Server', error }, { status: 500 });

//     }

// }

export const DELETE = async (req: NextRequest, { params }: Props) => {
    const { id } = await params;
    try {
        const ISuser = varfiyToken(req)
        if (!ISuser) {

            return NextResponse.json({ message: "your not allowd ,for bidena" }, { status: 403 })
        }

        const request = await prisma.bookingRequest.findUnique({
            where: { id: id as string }
        })
        if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });


        await prisma.bookingRequest.delete({ where: { id: id as string } })


        await prisma.room.update({
            where: { id: request.roomId },
            data: {
                status: "available"
            }
        })

        return NextResponse.json({ message: 'Booking request deleted successfully' }, { status: 200 });

    } catch (error) {
        console.log("*******************");
        console.log(error);
        return NextResponse.json({ message: 'Error intrnel Server', error }, { status: 500 });

    }
}