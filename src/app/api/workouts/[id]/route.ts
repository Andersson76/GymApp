import { NextRequest, NextResponse } from "next/server";
import { WorkoutSchema } from "@/lib/schemas/workout";
import { verifyToken } from "@/lib/jwt";
import { query } from "@/lib/db";

export const runtime = "nodejs";

// GET träningspass med id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const workoutId = Number(params.id);

  try {
    const result = await query(
      `SELECT * FROM workouts WHERE id = $1 AND user_id = $2;`,
      [workoutId, payload.userId]
    );

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const workoutId = Number(params.id);
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
    const result = await query(`
      UPDATE workouts
      SET title = ${title}, description = ${description}, date = ${date}, duration = ${duration}
      WHERE id = ${workoutId} AND user_id = ${payload.userId}
      RETURNING *;
    `);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const workoutId = Number(params.id);

  try {
    const result = await query(`
      DELETE FROM workouts
      WHERE id = ${workoutId} AND user_id = ${payload.userId}
      RETURNING *;
    `);
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
