import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Required Field!",
  }),
  password : z.string().min(6, {
    message: "Required Field! with minimum 6 characters",
  }),
});

export type loginSchemaTypes = z.infer<typeof loginSchema>