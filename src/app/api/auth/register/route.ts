import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import { signToken } from "@/lib/jwt";
import { isNonEmptyString, isValidEmail } from "@/lib/validators";
import type { User, NewUser } from "@/types/user";
import type { TokenPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body as NewUser;

    if (!isNonEmptyString(name)) {
      return apiError("Rätt skrivet namn krävs", 400);
    }

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    // Kontrollera om användaren redan finns
    const existing = await safeQuery<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!existing.success) {
      return apiError("Fel vid kontroll av e-post", 500);
    }

    if (existing.data.length > 0) {
      return apiError("E-postadressen är redan registrerad", 409);
    }

    // Skapa ny användare
    const result = await safeQuery<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    if (!result.success || result.data.length === 0) {
      return apiError("Kunde inte skapa användare", 500);
    }

    const user = result.data[0];

    // Skapa JWT token
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };
    const token = signToken(payload);

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /api/auth/register");
  }
}
