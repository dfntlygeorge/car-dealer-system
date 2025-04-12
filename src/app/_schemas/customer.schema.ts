import { z } from "zod";

export const SubmitDetailsSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  mobile: z.string().nonempty("Mobile number is required"),
  terms: z.enum(["true", "false"], {
    message: "You must agree to the terms and conditions",
  }),
});

export type SubmitDetailsSchemaType = z.infer<typeof SubmitDetailsSchema>;

export const CreateCustomerSchema = SubmitDetailsSchema.extend({
  date: z.date(),
  slug: z.string(),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
