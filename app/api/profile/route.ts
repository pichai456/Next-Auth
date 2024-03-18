import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession()
    console.log('session', session)
    return Response.json({
        massage: 'success',
        session

    })
}