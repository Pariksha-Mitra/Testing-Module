export const swaggerConfig = {
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pariksha Mitra API Documentation",
      version: "1.0.0",
      description:
        "API documentation for the Pariksha Mitra educational platform",
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/auth/signin": {
        post: {
          tags: ["Auth"],
          summary: "Sign in a user",
          description:
            "Allows a user to sign in using credentials or provider information.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", description: "User's username" },
                    password: { type: "string", description: "User's password" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "JWT token for authorization",
                      },
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "User ID" },
                          username: {
                            type: "string",
                            description: "Username of the logged-in user",
                          },
                          role: {
                            type: "string",
                            description: "Role of the user (e.g., teacher, student)",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/api/auth/session": {
        get: {
          tags: ["Auth"],
          summary: "Get user session",
          description: "Fetches the current session information.",
          responses: {
            200: {
              description: "Session information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "User ID" },
                          username: {
                            type: "string",
                            description: "Username of the logged-in user",
                          },
                          role: {
                            type: "string",
                            description: "Role of the user",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized, session not found",
            },
          },
        },
      },
    },
  },
};
