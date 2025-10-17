import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import * as bcrypt from "bcrypt";

export const authOptions = {
  callbacks: {
    async session({ session, token, user }) {
      // Ensure the session includes the user's email and ID
      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      } else if (token) {
        session.user = {
          id: token.sub,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user found");

        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };