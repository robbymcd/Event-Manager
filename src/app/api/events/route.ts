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
      query += " OR (category = 'private' AND university = $1)";
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

  // Extract event details from the request body
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

  if (!name || !category || !event_time || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if(category === 'rso' && !rsoIdValue) {
    return NextResponse.json({ error: 'RSO not found' }, { status: 400 });
  }

  try {
    // Insert event into the database
    const res = await pool.query(
      "INSERT INTO events (name, category, description, event_time, location, contact_phone, contact_email, university, rso, rso_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        name,
        category,
        description,
        event_time,
        location,
        contact_phone,
        contact_email,
        university || null,  // Handle optional university
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
