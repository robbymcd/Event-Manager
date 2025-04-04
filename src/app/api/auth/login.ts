import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (user.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  return NextResponse.json({ message: "Login successful" });
}
