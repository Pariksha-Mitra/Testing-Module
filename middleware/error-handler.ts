import { ApiError } from '@/utils/api-error';
import { NextResponse } from 'next/server';

type HandlerFunction = (req: Request) => Promise<NextResponse> | NextResponse;

export function withErrorHandler(handler: HandlerFunction) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      if (!req) {
        throw new ApiError(400, "Invalid request");
      }
      return await handler(req);
    } catch (error) {
      // Log full error in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        });
      }

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            data: error.data,
          },
          {
            status: error.statusCode,
            headers: {
              "Content-Type": "application/json",
              "X-Error-Code": error.statusCode.toString(),
            },
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          ...(process.env.NODE_ENV === "development" && {
            debug: error instanceof Error ? error.message : "Unknown error",
          }),
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "X-Error-Code": "500",
          },
        }
      );
    }
  };
}
