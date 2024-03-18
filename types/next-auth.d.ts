import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: int;
            name: string;
            email: string;
            role: string;
            image: string | null | undefined;
        };
    }
    interface User {
        id: int;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: int;
        role: string;
    }
}