import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, image: user.image ?? undefined },
        create: {
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        },
      });
      return true;
    },
    async session({ session }) {
      if (!session.user?.email) return session;
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        (session.user as any).id = dbUser.id;
        (session.user as any).role = dbUser.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});