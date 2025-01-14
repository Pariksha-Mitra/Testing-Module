import NextAuth from 'next-auth/next';
import { authOptions } from '@/utils/auth';
/**
 * @swagger
 * /api/auth/{nextauth}:
 *   description: "This file handles authentication using NextAuth."
 *   externalDocs:
 *     description: "Learn more about NextAuth.js"
 *     url: "https://next-auth.js.org/getting-started/introduction"
 *   get:
 *     summary: Handle authentication requests
 *     tags: [Auth]
 *   post:
 *     summary: Process authentication submissions
 *     tags: [Auth]
 */

const handler = NextAuth(authOptions);

if (!handler) {
  throw new Error("Failed to initialize NextAuth handler");
}

export { handler as GET, handler as POST };
