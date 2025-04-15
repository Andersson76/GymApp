import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import type { TokenPayload } from "@/types/auth";

export function middleware(request: NextRequest) {
  console.log("🔐 middleware triggas!");

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Ingen eller ogiltig token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken<TokenPayload>(token);

  if (!payload) {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  console.log("✅ JWT verifierad:", payload);

  const response = NextResponse.next();
  response.headers.set("X-User-Id", String(payload.userId));
  return response;
}

// 👇 Detta är nyckeln för att få använda jsonwebtoken i middleware
export const config = {
  matcher: ["/api/protected-test", "/api/debug-token", "/api/workouts/:path*"],
  runtime: "nodejs",
};
