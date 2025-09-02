import { Pool } from "pg";

const g = globalThis as unknown as { __pgPool?: Pool };

export const pgPool =
  g.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL, // använd POOLER-URL från Neon
    max: 5,
    idleTimeoutMillis: 10_000,
  });

if (!g.__pgPool) g.__pgPool = pgPool;

// Liten hjälpare om du vill anropa direkt:
export const query = pgPool.query.bind(pgPool);

// Gammal kod:

/* import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = pool.query.bind(pool); */
