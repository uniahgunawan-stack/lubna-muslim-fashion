import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No credentials provided");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          console.log("User not found or no password:", credentials.email);
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          console.log("Invalid password for:", credentials.email);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "USER",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
  if (user) {
    token.role = user.role || "USER";
    token.id = user.id;
    console.log("JWT callback - Role assigned:", token.role);
  }

  if (!token.id || typeof token.id !== "string") {
    console.log("JWT callback - Invalid token.id");
    return { ...token, id: "", role: "USER" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: token.id },
  }).catch((error) => {
    console.error("Database error:", error)
    return null;
  });

  if (!existingUser) {
    console.log("JWT callback - User not found in DB, clearing token");
    return { ...token, id: "", role: "USER" };
  }

  return token;
},

    async session({ session, token }) {

        if (!token.id || typeof token.id !== "string"){

          console.log("session callback -Toen invalid, return null")
          return {
        ...session,
        user: {
          id: "",
          name: "",
          email: "",
          role: "USER",
        },
      };
    }

        const existingUser = await prisma.user.findUnique({
      where: { id: token.id as string },
    }).catch((error) => {
      console.error("Database error", error)
      return null;
    })

    if (!existingUser) {
      console.log("Session callback - User not found in DB, returning null");
       return {
        ...session,
        user: {
          id: "",
          name: "",
          email: "",
          role: "USER",
        },
      };
    };


      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = ["ADMIN", "USER"].includes(token.role) ? token.role : "USER";
        console.log("Session callback - Session updated:");
      }
      return session;
    },
  },
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}