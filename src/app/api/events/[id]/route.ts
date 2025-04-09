import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [params.id]);
  
  if (rows.length === 0) {
    return NextResponse.json({ error: "Event not found"}, 
      { status: 404 });
  }
  
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    name,
    category,
    event_time,
    location,
    contact_phone,
    contact_email,
  } = await req.json();

  const res = await pool.query(
    "UPDATE events SET name = $1, category = $2, event_time = $3, location = $4, contact_phone = $5, contact_email = $6 WHERE id = $7 RETURNING *",
    [
      name,
      category,
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
