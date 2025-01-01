import { createSwaggerSpec } from "next-swagger-doc";
import { swaggerConfig } from "@/swagger.config";
import { NextResponse } from "next/server";

export async function GET() {
  const spec = createSwaggerSpec(swaggerConfig);
  return NextResponse.json(spec);
}
