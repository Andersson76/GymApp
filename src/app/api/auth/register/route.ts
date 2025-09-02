import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import { signToken } from "@/lib/jwt";
import { isNonEmptyString, isValidEmail } from "@/lib/validators";
import { RegisterSchema } from "@/lib/schemas/auth";
import type { User, NewUser } from "@/types/user";
import type { TokenPayload } from "@/types/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return apiError("Felaktigt ifylld registreringsdata", 400);
    }

    const newUser: NewUser = result.data;
    const { name, email, password } = newUser;

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    if (!isNonEmptyString(name)) {
      return apiError("Namn krävs", 400);
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
    const resultInsert = await safeQuery<User>(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    if (!resultInsert.success || resultInsert.data.length === 0) {
      return apiError("Kunde inte skapa användare", 500);
    }

    const user = resultInsert.data[0];
    console.log("Registreringsförsök:", name, email, password);

    // Skapa JWT token
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const token = signToken(payload);

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /api/auth/register");
  }
}
