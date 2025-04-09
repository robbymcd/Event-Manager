import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const event_id = await req.json();
  const { rows } = await pool.query("SELECT * FROM ratings WHERE event_id = $1", [
    event_id,
  ]);
  if (rows.length === 0) {
    return NextResponse.json({ message: "No ratings found" });
  }
  const ratings = rows.map((row) => ({
    id: row.id,
    comment_id: row.comment_id,
    user_id: row.user_id,
    event_id: row.event_id,
    rating: row.rating,
    comment: row.comment,
  }));
  return NextResponse.json(ratings);
}

export async function POST(req: NextRequest) {
  const { comment_id, user_id, event_id, rating, comment } = await req.json();

  const res = await pool.query(
    "INSERT INTO ratings (comment_id, user_id, event_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [comment_id, user_id, event_id, rating, comment]
  );

  return NextResponse.json(res.rows[0]);
}
