import NextAuth from "next-auth";
import type { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

const prisma = new PrismaClient();

interface CustomJWT extends JWT {
  id?: string;
  role?: string | null;
}

interface CustomUser extends User {
  id: string;
  role?: string | null;
}

interface CustomSession extends Session {
  user?: {
    id?: string;
    role?: string | null;
    name?: string | null;
    email?: string | null;
  };
}

export const authOptions = {
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
          id: user.id.toString(),
          name: user.nome,
          email: user.email,
          role: user.roles,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomJWT }) {
      if (token?.id) {
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
