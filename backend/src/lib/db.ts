import { Pool } from "pg";
import { env } from "../config/env";

const pool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    })
  : null;

export const db = Object.freeze({
  enabled: Boolean(pool),
  async query<T>(sql: string, values: unknown[] = []): Promise<T[]> {
    if (!pool) {
      throw new Error("DATABASE_URL is not set");
    }
    const result = await pool.query(sql, values);
    return result.rows as T[];
  }
});
