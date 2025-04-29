import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("ogiltlig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>; // samma som NewUser
