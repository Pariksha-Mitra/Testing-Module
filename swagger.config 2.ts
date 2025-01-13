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
          bearerFormat: "JWT"
        }
      }
    }
  },
};
