import { z } from "zod";

export const TestSchema = z.object({
  test_title: z.string().trim().min(1, "Required Field"),
  created_at: z.date().default(() => new Date()),
  created_by: z.string().trim().min(1, "Required Field"),
  valid_upto: z.string().trim().min(1, "Required Field"),
  marks: z.number().min(0, "Required Field"),
  questions: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"))
    .min(1, "Required Field"),
});

export type TestSchemaType = z.infer<typeof TestSchema>;
