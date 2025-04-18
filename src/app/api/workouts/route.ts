import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
//import { sql } from "@vercel/postgres";
import { WorkoutSchema } from "@/lib/schemas/workout";
import { query } from "@/lib/db"; // eller var din export finns

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = verifyToken(token ?? "");
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await query(
      `
      SELECT id, title, date, description, duration, created_at
      FROM workouts
      WHERE user_id = $1
      ORDER BY date DESC;
      `,
      [payload.userId]
    );
    return NextResponse.json({ workouts: result.rows }, { status: 200 });
  } catch (err) {
    console.error("Fel vid hämtning:", err);
    return NextResponse.json(
      { error: "Kunde inte hämta träningspass" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = verifyToken(token ?? "");
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = WorkoutSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const { title, description, date, duration } = result.data;

  try {
    const result = await query(
      `
      INSERT INTO workouts (user_id, title, description, date, duration)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [payload.userId, title, description || null, date, duration]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Fel vid skapande:", err);
    return NextResponse.json(
      { error: "Kunde inte skapa träningspass" },
      { status: 500 }
    );
  }
}
