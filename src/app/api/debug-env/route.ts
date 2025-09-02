export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    db: process.env.DATABASE_URL ? "OK" : "MISSING",
    jwt: process.env.JWT_SECRET ? "OK" : "MISSING",
  });
}
