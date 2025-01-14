import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { AuthOptions, Session, SessionStrategy } from 'next-auth';
import userModel from '../models/user.model';
import { connectDb } from './db';
import { JWT } from 'next-auth/jwt';
import { ROLE } from './types';

type CredentialsType = {
  username: string;
  password: string;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text", placeholder: "username" },
        password: { type: "password", placeholder: "password" },
      },
      authorize: async (credentials: CredentialsType | undefined) => {
        if (!credentials) {
          console.error("Please provide the credentials!");
          return null;
        }

        await connectDb();

        try {
          if (!credentials.password || !credentials.username) {
            throw new Error("Missing fields!");
          }

          const user = await userModel
            .findOne({ username: credentials.username })
            .select("_id username password role")
            .lean();

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.warn("Authorization error");
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.username = user.username;
        token.id = user.id;
        token.role = user.role as ROLE;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user.username = token.username;
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
