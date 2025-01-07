import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { Role, ROLES } from "./server/utils/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: ROLE;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    role?: ROLE;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: ROLE;
  }
}
