import { Pool } from "pg";
import { compare } from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

/**
 * Find user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows[0] ?? null;
  } finally {
    client.release();
  }
}

/**
 * Validate plain password against hashed password
 */
export async function validatePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}
