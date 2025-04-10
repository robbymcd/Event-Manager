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
    // Super admins can see all approved events
    query = "SELECT * FROM events WHERE approved = true";
  } else if (role === 'admin') {
    // Admins can see all approved public events and approved events at their university
    query = "SELECT * FROM events WHERE approved = true AND (category = 'public' OR university = $1)";
    params = [universityId];
  } else {
    // Students see approved public events + private (if at same university) + RSO (if member)
    query = "SELECT * FROM events WHERE approved = true AND (category = 'public'";
    
    if (universityId) {
      query += " OR (category = 'private' AND university = $1)";
      params.push(universityId);
    }

    if (rsoId) {
      query += ` OR (category = 'rso' AND rso = $${params.length + 1})`;
      params.push(rsoId);
    }

    query += ")";
  }

  query += " ORDER BY event_time ASC";

  const { rows } = await pool.query(query, params);
  return NextResponse.json(rows);
}


export async function POST(req: NextRequest) {  

  // Extract event details from the request body
  const body = await req.json();
  console.log("Received event data:", body);

  const {
    name,
    category,
    event_time,
    location,
    contact_phone,
    contact_email,
    university,
    rso
  } = body;

  console.log("University value:", university);

  const rsoParam = rso;

  let rsoIdValue = null;
  let rsoName = null;

  if (rsoParam && rsoParam !== 'null') {

    const rsoQuery = "SELECT id, name FROM rso WHERE name = $1";
    const rsoRes = await pool.query(rsoQuery, [rsoParam]);

    if (rsoRes.rows.length > 0) {
      rsoIdValue = rsoRes.rows[0]?.id;
      rsoName = rsoRes.rows[0]?.name;
    }
  }

  const checkQuery = "SELECT * FROM events WHERE event_time = $1 AND location = $2";
  const checkRes = await pool.query(checkQuery, [event_time, location]);
  if (checkRes.rows.length > 0) {
    return NextResponse.json({ error: 'Event already exists at this time and location' }, { status: 400 });
  }

  if (!name || !category || !event_time || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if(category === 'rso' && !rsoIdValue) {
    return NextResponse.json({ error: 'RSO not found' }, { status: 400 });
  }

  try {
    // Insert event into the database
    const res = await pool.query(
      "INSERT INTO events (name, category, event_time, location, contact_phone, contact_email, university, rso, rso_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        category,
        event_time,
        location,
        contact_phone,
        contact_email,
        university,
        rsoIdValue || null,   // Use the found RSO ID, or null if not found
        rsoName || null       // Use the RSO name, or null if not found
      ]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error inserting event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
