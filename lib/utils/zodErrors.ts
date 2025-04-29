export function extractZodError(errorObj: unknown): string | null {
  if (
    errorObj &&
    typeof errorObj === "object" &&
    "message" in errorObj &&
    typeof (errorObj as { message: unknown }).message === "string"
  ) {
    return (errorObj as { message: string }).message;
  }
  return null;
}
