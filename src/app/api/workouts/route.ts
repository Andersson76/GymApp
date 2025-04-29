import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { WorkoutSchema } from "@/lib/schemas/workout";
import { query } from "@/lib/db";

// Hämta alla träningspass
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

// Skapa nytt träningspass
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

// Uppdatera träningspass
export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = verifyToken(token ?? "");
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, description, date, duration } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Träningspassets ID saknas" },
      { status: 400 }
    );
  }

  try {
    const updateResult = await query(
      `
      UPDATE workouts
      SET title = $1, description = $2, date = $3, duration = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *;
      `,
      [title, description || null, date, duration, id, payload.userId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Passet hittades inte eller tillhör inte användaren" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateResult.rows[0], { status: 200 });
  } catch (err) {
    console.error("Fel vid uppdatering:", err);
    return NextResponse.json(
      { error: "Kunde inte uppdatera träningspass" },
      { status: 500 }
    );
  }
}

// Radera träningspass
export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = verifyToken(token ?? "");
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Träningspassets ID saknas" },
      { status: 400 }
    );
  }

  try {
    const deleteResult = await query(
      `
      DELETE FROM workouts
      WHERE id = $1 AND user_id = $2
      RETURNING *;
      `,
      [id, payload.userId]
    );

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Passet hittades inte eller tillhör inte användaren" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Träningspass raderat" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Fel vid radering:", err);
    return NextResponse.json(
      { error: "Kunde inte radera träningspass" },
      { status: 500 }
    );
  }
}
