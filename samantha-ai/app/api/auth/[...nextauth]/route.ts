import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import pool from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const client = await pool.connect();
        try {
          const res = await client.query(
            "SELECT id, name, email, password FROM users WHERE email = $1",
            [credentials.email],
          );
          const user = res.rows[0];

          console.log(user);

          if (!user) return null;

          if (credentials.password !== user.password) return null;

          return { id: user.id, email: user.email, name: user.name };
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
