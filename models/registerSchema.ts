import { z } from "zod";
import { ROLE } from "../utils/types";

export const registerSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required!",
  }),
  middleName: z.string().optional(),
  surname: z.string().min(1, { message: "Surname is required!" }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format!",
  }),
  slug: z.string({ message: "Slug is required!" }),
  role: z.enum([ROLE.Teacher, ROLE.Student], {
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
});

export type RegisterSchemaTypes = z.infer<typeof registerSchema>;
