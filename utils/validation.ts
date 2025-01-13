import { z } from "zod";
import { ApiError } from "./api-error";
import { ErrorCodes } from "./error-codes";

/**
 * Validates the input data using the specified zod schema.
 * @param schema - The zod schema.
 * @param data - The data to validate.
 * @throws ApiError if validation fails.
 */
export function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(ErrorCodes.BAD_REQUEST, "Validation failed", {
      errors: result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }
  return result.data;
}
