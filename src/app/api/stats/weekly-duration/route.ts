import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/jwt"; // för att få user_id från token

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return new Response("Invalid token payload", { status: 401 });
    }
    const userId = payload.userId;

    const result = await query(
      `
      SELECT
        DATE_TRUNC('week', date) AS week,
        SUM(duration) AS minutes
      FROM workouts
      WHERE user_id = $1
      GROUP BY week
      ORDER BY week;
    `,
      [userId]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("Statistikfel:", error);
    return new Response("Server error", { status: 500 });
  }
}
