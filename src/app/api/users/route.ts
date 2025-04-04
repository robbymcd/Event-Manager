import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { username, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const res = await pool.query(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
    [username, hashedPassword, role]
  );

  return NextResponse.json(res.rows[0]);
}
