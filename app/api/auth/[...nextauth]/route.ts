import NextAuth, { Account, AuthOptions, Profile, Session, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { compare } from "bcrypt-ts";
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from 'next-auth/jwt'
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

const prisma = new PrismaClient()


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'next@mail.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { email } = credentials;
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                if (user && (await compare(credentials.password, user.password as string))) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } else {
                    throw new Error("Invalid email or password");
                }

            },

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
            if (token) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.image = token.picture
            }
            return session;
        },
        async redirect({ baseUrl }: { baseUrl: string }): Promise<string> {
            return `${baseUrl}/profile`
        },
    },
}

const handler = NextAuth(authOptions as AuthOptions)

export { handler as GET, handler as POST }