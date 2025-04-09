import { TokenPayload } from "@/types/auth";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET saknas i .env-filen");
}

// Skapa ett JWT-token från payload
export function signToken(payload: TokenPayload, options?: SignOptions): string {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "1h", // default
    ...options,
  });
}

// Verifiera ett JWT-token och returnera innehållet (eller null om ogiltigt)
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  } catch {
    return null;
  }
}
