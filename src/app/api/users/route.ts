import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { isNonEmptyString, isValidEmail } from "@/lib/validators";
import { handleError } from "@/lib/handleError";
import type { User, NewUser, PublicUser } from "@/types/user";

export async function GET() {
  try {
    const result = await safeQuery<User>(
      "SELECT id, name, email, password, created_at FROM users ORDER BY id ASC"
    );

    if (!result.success) {
      return apiError("Kunde inte hämta användare", 500);
    }

    // Ta bort password innan vi skickar till frontend:
    const publicUsers: PublicUser[] = result.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...rest }) => rest
    );

    return Response.json(publicUsers, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body as NewUser;

    if (!isNonEmptyString(name)) {
      return apiError("Rätt skrivet namn krävs", 400);
    }

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    const queryText = password
      ? "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at"
      : "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at";

    const params = password ? [name, email, password] : [name, email];

    const result = await safeQuery<User>(queryText, params);

    if (!result.success) {
      return apiError("Kunde inte skapa användare", 500);
    }

    return Response.json({ user: result.data[0] }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
