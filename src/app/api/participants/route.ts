import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET({ params }: { params: { id: string } }) {
  const { rows } = await pool.query(
    "SELECT * FROM event_participants WHERE event_id = $1",
    [params.id]
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { user_id, event_id } = await req.json();

  const res = await pool.query(
    "INSERT INTO event_participants (user_id, event_id) VALUES ($1, $2) RETURNING *",
    [user_id, event_id]
  );

  return NextResponse.json(res.rows[0]);
}
