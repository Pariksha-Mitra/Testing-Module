import { z } from "zod";
import { ApiError } from "./api-error";
import { ErrorCodes } from "./error-codes";

export function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(ErrorCodes.BAD_REQUEST, "Validation failed", {
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    throw error;
  }
}
