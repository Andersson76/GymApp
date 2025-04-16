import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { sql } from "@vercel/postgres";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const workoutId = Number(params.id);

  try {
    const result = await sql`
      SELECT * FROM workouts
      WHERE id = ${workoutId} AND user_id = ${payload.userId};
    `;
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error fetching workout" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { title, description, date, duration } = await req.json();
  const workoutId = Number(params.id);

  try {
    const result = await sql`
      UPDATE workouts
      SET title = ${title}, description = ${description}, date = ${date}, duration = ${duration}
      WHERE id = ${workoutId} AND user_id = ${payload.userId}
      RETURNING *;
    `;
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Workout not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error updating workout" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const workoutId = Number(params.id);

  try {
    const result = await sql`
      DELETE FROM workouts
      WHERE id = ${workoutId} AND user_id = ${payload.userId}
      RETURNING *;
    `;
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Workout not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error deleting workout" },
      { status: 500 }
    );
  }
}
