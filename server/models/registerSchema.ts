import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required!",
  }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, {
    message: "Last name is required!",
  }),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format!",
    }),
  role: z.enum(["Teacher", "Student"], {
    message: "Role must be either 'Teacher' or 'Student'",
  }),
  schoolName: z.string().min(1, {
    message: "School name is required!",
  }),
  email: z.string().email({
    message: "Invalid email address!",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long!",
  }),
  invitationId: z.string().optional(),
});

export type RegisterSchemaTypes = z.infer<typeof registerSchema>;
