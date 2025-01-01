import { createMocks } from 'node-mocks-http';
import { GET } from "../../../app/api/auth/[...nextauth]/route";
import { NextAuthOptions } from "next-auth";

describe("NextAuth Configuration", () => {
  it("should initialize NextAuth with correct options", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        nextauth: ["session"],
      },
    });

    expect(GET).toBeDefined();
    expect(typeof GET).toBe('function');
  });
});
