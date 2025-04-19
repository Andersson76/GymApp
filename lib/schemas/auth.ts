import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("ogiltlig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
