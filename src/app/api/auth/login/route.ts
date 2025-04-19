import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import { signToken } from "@/lib/jwt";
import { isValidEmail } from "@/lib/validators";
import { LoginSchema } from "@/lib/schemas/auth";
import type { User } from "@/types/user";
import type { TokenPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Kör först LoginSchema från zod
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return apiError("Felaktigt ifylld e-post eller lösenord", 400);
    }

    const { email, password } = result.data;

    // Extra validering via lib/validators
    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    const userResult = await safeQuery<User>(
      "SELECT * FROM users WHERE email = $1",
      [email, password]
    );

    console.log("safeQuery login-resultat:", userResult);

    if (!userResult.success) {
      console.error("DB-fel vid login:", userResult.error);
      return apiError("Kunde inte kontrollera inloggning", 500);
    }

    if (userResult.data.length === 0) {
      return apiError("E-postadressen finns inte", 404);
    }

    const user = userResult.data[0];

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = signToken(payload);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return handleError(error, "POST /api/auth/login");
  }
}
