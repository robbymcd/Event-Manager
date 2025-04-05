import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log(email);
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const { id, role, university } = user.rows[0];

  return NextResponse.json({ 
    message: "Login successful",
    user: { id, email, role, university},
  });
}
