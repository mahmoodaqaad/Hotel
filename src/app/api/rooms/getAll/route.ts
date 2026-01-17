import { NextResponse } from "next/server"

export const GET = async () => {
    try {


    } catch (error) {
        return NextResponse.json({ message: "internal server error", error }, { status: 500 })

    }
}