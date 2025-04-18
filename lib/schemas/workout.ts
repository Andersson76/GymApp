import { z } from "zod";

export const WorkoutSchema = z.object({
  title: z.string().min(1, "Titel krävs"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ogiltigt datumformat (YYYY-MM-DD)"),
  description: z.string().optional(),
  duration: z
    .number()
    .int()
    .positive("Duration måste vara ett positivt heltal"),
});

export type WorkoutInput = z.infer<typeof WorkoutSchema>;
