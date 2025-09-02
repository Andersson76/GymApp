// app/api/debug-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import type { TokenPayload } from "@/types/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const payload = verifyToken<TokenPayload>(token);
  console.log("Verifierad JWT payload:", payload);

  return NextResponse.json({ payload });
}
