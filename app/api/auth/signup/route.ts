import { hashSync } from "bcrypt-ts";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        const hashPassword = hashSync(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashPassword }
        })
        return Response.json({
            massage: 'success',
            data: {
                name,
                email,
                hashPassword,
            }

        })
    } catch (error) {
        return Response.json({
            massage: 'failed',

        })
    }
}