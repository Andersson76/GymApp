import { safeQuery } from "@/lib/safeQuery";
import { apiError } from "@/lib/apiError";
import { handleError } from "@/lib/handleError";
import {
  isNonEmptyString,
  isValidEmail,
  isPositiveInteger,
} from "@/lib/validators";
import type { User, NewUser } from "@/types/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  if (!isPositiveInteger(userId)) {
    return apiError("Ogiltigt ID", 400);
  }

  const result = await safeQuery<User>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  if (!result.success) {
    return apiError("Kunde inte hämta användaren", 500);
  }

  if (result.data.length === 0) {
    return apiError("Användaren finns inte", 404);
  }

  return Response.json(result.data[0], { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (!isPositiveInteger(userId)) {
      return apiError("Ogiltigt ID", 400);
    }

    const body = await request.json();
    const { name, email } = body as NewUser;

    if (!isNonEmptyString(name)) {
      return apiError("Rätt skrivet namn krävs", 400);
    }

    if (!isValidEmail(email)) {
      return apiError("Rätt skriven email krävs", 400);
    }

    const result = await safeQuery<User>(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );

    if (!result.success) {
      return apiError("Kunde inte uppdatera användare", 500);
    }

    if (result.data.length === 0) {
      return apiError("Användaren finns inte", 404);
    }

    return Response.json({ user: result.data[0] }, { status: 200 });
  } catch (error) {
    return handleError(error, "PUT /api/users/[id]");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (!isPositiveInteger(userId)) {
      return apiError("Ogiltigt ID", 400);
    }

    const result = await safeQuery<User>(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );

    if (!result.success) {
      return apiError("Kunde inte ta bort användare", 500);
    }

    if (result.data.length === 0) {
      return apiError("Användaren finns inte", 404);
    }

    return Response.json({ deletedUser: result.data[0] }, { status: 200 });
  } catch (error) {
    return handleError(error, "DELETE /api/users/[id]");
  }
}
