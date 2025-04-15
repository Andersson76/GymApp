// app/api/workouts/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "✅ Du är inloggad och får se träningspass!",
    workouts: [
      { id: 1, type: "Styrketräning", duration: 45 },
      { id: 2, type: "Kondition", duration: 30 },
    ],
  });
}
