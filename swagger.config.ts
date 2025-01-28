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
        url: process.env.NEXTAUTH_URL || "https://testing-module-fork.vercel.app",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
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
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            data: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: {
                        type: "string",
                        example: "schoolId",
                      },
                      message: {
                        type: "string",
                        example: "School ID is required",
                      },
                    },
                  },
                },
              },
            },
          },
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
                    username: {
                      type: "string",
                      description: "User's username",
                    },
                    password: {
                      type: "string",
                      description: "User's password",
                    },
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
                            description:
                              "Role of the user (e.g., teacher, student)",
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
      "/api/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "firstName",
                    "surname",
                    "dateOfBirth",
                    "role",
                    "schoolId",
                  ],
                  properties: {
                    firstName: {
                      type: "string",
                      example: "John",
                    },
                    middleName: {
                      type: "string",
                      example: "Middle",
                    },
                    surname: {
                      type: "string",
                      example: "Doe",
                    },
                    dateOfBirth: {
                      type: "string",
                      format: "date",
                      example: "2000-01-01",
                    },
                    role: {
                      type: "string",
                      enum: ["teacher", "student"],
                      example: "teacher",
                    },
                    schoolId: {
                      type: "string",
                      example: "शाळा क्रमांक १",
                      description: "School identifier",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description: "Required for teachers only",
                    },
                    invitationId: {
                      type: "string",
                      description: "Required for teachers only",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "User registered successfully!",
                      },
                      user: {
                        type: "object",
                        properties: {
                          username: {
                            type: "string",
                            example: "john@123",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationError",
                  },
                },
              },
            },
            409: {
              description: "User already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts",
    ".next/server/**/*.js"
  ],
};
