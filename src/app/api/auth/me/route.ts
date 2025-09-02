import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { safeQuery } from "@/lib/safeQuery";
import { User } from "@/types/user";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { message: "Ingen token angiven" },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { message: "Ogiltig eller utgången token" },
      { status: 401 }
    );
  }
  // Hämta användare från DB med userId från token
  const userResult = await safeQuery<User>(
    "SELECT id, email, name FROM users WHERE id = $1",
    [payload.userId]
  );

  if (!userResult.success || userResult.data.length === 0) {
    return NextResponse.json(
      { message: "Användare ej hittad" },
      { status: 404 }
    );
  }

  const user: User = userResult.data[0];

  return NextResponse.json({ user });
}
