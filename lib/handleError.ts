import { apiError } from "@/lib/apiError";

export function handleError(error: unknown, context?: string) {
  // Logga med kontext
  if (context) {
    console.error(`[${context}]`, error);
  } else {
    console.error(error);
  }

  // Specialfall: Ogiltig JSON från frontend
  if (error instanceof SyntaxError) {
    return apiError("Ogiltig JSON i requesten", 400);
  }

  // Fel som har ett messagefält
  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError("Ett okänt fel inträffade", 500);
}
