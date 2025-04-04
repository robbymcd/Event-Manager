import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM ratings");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { user_id, event_id, rating, comment } = await req.json();

  const res = await pool.query(
    "INSERT INTO ratings (user_id, event_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [user_id, event_id, rating, comment]
  );

  return NextResponse.json(res.rows[0]);
}
