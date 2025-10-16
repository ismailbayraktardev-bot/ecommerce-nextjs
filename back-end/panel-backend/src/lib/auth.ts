import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'; // Import at the top level

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Find user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // 3. Check if user exists and has a password (i.e., not an OAuth user)
        if (!user || !user.password) {
          return null;
        }

        // 4. Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // 5. If valid, return the user object. NextAuth will handle the rest.
        if (isPasswordValid) {
          return user;
        }

        // 6. If not valid, return null
        return null;
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect users to a custom login page
  }
})