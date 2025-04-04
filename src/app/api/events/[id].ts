import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET({ params }: { params: { id: string } }) {
  const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [
    params.id,
  ]);
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    name,
    category,
    description,
    event_time,
    location,
    contact_phone,
    contact_email,
  } = await req.json();

  const res = await pool.query(
    "UPDATE events SET name = $1, category = $2, description = $3, event_time = $4, location = $5, contact_phone = $6, contact_email = $7 WHERE id = $8 RETURNING *",
    [
      name,
      category,
      description,
      event_time,
      location,
      contact_phone,
      contact_email,
      params.id,
    ]
  );

  return NextResponse.json(res.rows[0]);
}

export async function DELETE({ params }: { params: { id: string } }) {
  await pool.query("DELETE FROM events WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Event deleted successfully" });
}
