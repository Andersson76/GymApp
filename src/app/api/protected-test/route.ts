import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Du har JWT och får se detta 🎉" });
}
