import { ROLE } from "../utils/types";
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required!",
  }),
  middleName: z.string().optional(),
  surname: z.string().min(1, { message: "Surname is required!" }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format!",
  }),
  slug: z.string().min(1, { message: "Slug is required!" }),
  role: z.nativeEnum(ROLE, {
    message: "Role must be either 'teacher' or 'student'",
  }),
  schoolId: z.string().min(1, {
    message: "School ID is required!",
  }),
  email: z
    .string()
    .email({
      message: "Invalid email address!",
    })
    .optional(),
  invitationId: z.string().optional(),
  rollNo: z.number().optional(),
  division: z.enum(["A", "B", "C"]).optional(),
});

export type RegisterSchemaTypes = z.infer<typeof registerSchema>;
