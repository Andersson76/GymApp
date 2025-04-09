import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { isNonEmptyString, isValidEmail } from "@/lib/validators";
import { handleError } from "@/lib/handleError";
import type { User, NewUser } from "@/types/user";

export async function GET() {
  const result = await safeQuery<User>("SELECT * FROM users ORDER BY id ASC");

  if (!result.success) {
    return apiError("Kunde inte hämta användare", 500);
  }

  return Response.json(result.data, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body as NewUser;

    if (!isNonEmptyString(name)) {
      return apiError("Rätt skrivet namn krävs", 400);
    }

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    const result = await safeQuery<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    if (!result.success) {
      return apiError("Kunde inte skapa användare", 500);
    }

    return Response.json({ user: result.data[0] }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
