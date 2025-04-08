import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log("Connecting to DB:", process.env.DATABASE_URL);
export const query = pool.query.bind(pool);
