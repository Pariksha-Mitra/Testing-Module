import { z } from "zod";

export const schoolSchema = z.object({
  name: z.string().nonempty({ message: "Required!" }),
  schoolId : z.string().nonempty({ message: "Required!" }),
  contact : z.string().nonempty({ message : "Required!"}),
  address : z.string().nonempty({ message : "Required!"})
});

export type schoolSchemaType = z.infer<typeof schoolSchema>