import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET request: Fetch ratings for a specific event
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const event_id = searchParams.get("event_id");

  // Validate event_id
  if (!event_id) {
    return NextResponse.json({ error: "Missing event_id query parameter" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Only call this once
    console.log("Request body:", body);

    // Destructure the fields from the parsed body
    const { comment_id, user_id, event_id, rating, comment } = body;

    // Basic validation for required fields
    if (!comment_id || !user_id || !event_id || rating === undefined || !comment) {
      console.error("Missing required fields:", body);
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into the database
    const res = await pool.query(
      "INSERT INTO ratings (comment_id, user_id, event_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [comment_id, user_id, event_id, rating, comment]
    );

    // Return the inserted record
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Failed to insert rating:", error);
    return NextResponse.json(
      { message: "Failed to insert rating" },
      { status: 500 }
    );
  }
}