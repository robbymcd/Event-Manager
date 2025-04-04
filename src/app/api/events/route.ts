import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM events");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
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
    "INSERT INTO events (name, category, description, event_time, location, contact_phone, contact_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      name,
      category,
      description,
      event_time,
      location,
      contact_phone,
      contact_email,
    ]
  );

  return NextResponse.json(res.rows[0]);
}
