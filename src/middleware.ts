import { NextRequest, NextResponse } from "next/server";
//import { verifyToken } from "@/lib/auth";
import type { TokenPayload } from "@/types/auth";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";

export async function middleware(request: NextRequest) {
  console.log("🔐 middleware triggas!");

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Ingen eller ogiltig token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  // Logga token direkt efter att den plockats ut
  console.log("🔐 Token från header:", token);

  const payload = (await verifyToken(token)) as TokenPayload | null;

  // Logga resultatet av verifyToken
  console.log("🔐 Payload från verifyToken:", payload);

  if (!payload) {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  console.log("✅ JWT verifierad:", payload);

  const response = NextResponse.next();
  response.headers.set("X-User-Id", String(payload.userId));
  return response;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/api/protected-test", "/api/debug-token", "/api/workouts/:path*"],
};
