import { query } from "@/lib/db";

type QueryResult<T> =
  | {
      success: true;
      data: T[];
    }
  | {
      success: false;
      error: unknown;
    };

export async function safeQuery<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
  try {
    const result = await query(sql, params);
    return { success: true, data: result.rows as T[] };
  } catch (error) {
    console.error("safeQuery error: ", error);
    return { success: false, error };
  }
}
