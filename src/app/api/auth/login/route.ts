import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import { signToken } from "@/lib/jwt";
import { isValidEmail } from "@/lib/validators";
import type { User } from "@/types/user";
import type { TokenPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    const result = await safeQuery<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    console.log("safeQuery login-resultat:", result);

    if (!result.success) {
      console.error("DB-fel vid login:", result.error);
      return apiError("Kunde inte kontrollera inloggning", 500);
    }

    if (result.data.length === 0) {
      return apiError("E-postadressen finns inte", 404);
    }

    const user = result.data[0];

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
