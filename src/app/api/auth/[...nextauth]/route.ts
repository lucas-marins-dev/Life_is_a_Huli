import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions={
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuarios.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.senha) return null;

        const isValid = await bcrypt.compare(credentials.password, user.senha);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.roles,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
