import { NextRequest, NextResponse } from "next/server";
import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import { signToken } from "@/lib/jwt";
import { LoginSchema } from "@/lib/schemas/auth";
import type { User } from "@/types/user";
import type { TokenPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return apiError("Felaktigt ifylld e-post eller lösenord", 400);
    }

    const { email, password } = result.data;

    // Kontrollera att användaren finns och att lösenord matchar
    const userResult = await safeQuery<User>(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    console.log("safeQuery login-resultat:", userResult);

    if (!userResult.success) {
      console.error("DB-fel vid login:", userResult.error);
      return apiError("Kunde inte kontrollera inloggning", 500);
    }

    if (userResult.data.length === 0) {
      return apiError("Fel e-post eller lösenord", 401);
    }

    const user = userResult.data[0];

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    const token = signToken(payload);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return handleError(error, "POST /api/auth/login");
  }
}
