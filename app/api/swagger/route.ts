import swaggerJsdoc from "swagger-jsdoc";
import { NextResponse } from "next/server";
import { swaggerConfig } from "@/swagger.config";

export async function GET() {
  try {
    const spec = swaggerJsdoc(swaggerConfig);
    return NextResponse.json(spec, { status: 200 });
  } catch (error) {
    console.error("Error generating Swagger spec:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate API documentation" },
      { status: 500 }
    );
  }
}
