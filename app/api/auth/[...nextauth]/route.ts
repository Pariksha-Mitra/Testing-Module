/**
 * @swagger
 * /api/auth/{nextauth}:
 *   description: "This file handles authentication using NextAuth."
 *   externalDocs:
 *     description: "Learn more about NextAuth.js"
 *     url: "https://next-auth.js.org/getting-started/introduction"
 */
import { authOptions } from "@/utils/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
