import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const role = searchParams.get("role");
  const rsoParam = searchParams.get("rso");
  const universityParam = searchParams.get("university");

  const rsoId = rsoParam === 'null' || !rsoParam ? null : rsoParam;
  const universityId = universityParam === 'null' || !universityParam ? null : universityParam;

  let query = "";
  let params: any[] = [];

  if (role === 'super-admin') {
    // Super admins can see all events
    query = "SELECT * FROM events";
    params = [];
  } else if (role === 'admin') {
    // Regular admins can see all public events and all events for their university
    query = "SELECT * FROM events WHERE category = 'public' OR university = $1";
    params = [universityId];
  } else {
    // else students 
    query = "SELECT * FROM events WHERE category = 'public'"; // Public events visible to everyone
    
    if (universityId) {
      query += " OR (category = 'university' AND university = $1)";
      params.push(universityId);
    }
    
    if (rsoId) {
      query += ` OR (category = 'rso' AND rso = $${params.length + 1})`;
      params.push(rsoId);
    }
  }

  query += " ORDER BY event_time ASC";

  const { rows } = await pool.query(query, params);
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
    university,
    rso
  } = await req.json();

  const res = await pool.query(
    "INSERT INTO events (name, category, description, event_time, location, contact_phone, contact_email, university, rso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      name,
      category,
      description,
      event_time,
      location,
      contact_phone,
      contact_email,
      university,
      rso
    ]
  );

  return NextResponse.json(res.rows[0]);
}
