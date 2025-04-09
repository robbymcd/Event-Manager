import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { time } from "console";

// GET request: Fetch comments for a specific event
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const event_id = searchParams.get("event_id");

  if (!event_id) {
    return NextResponse.json(
      { error: "Missing event_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT comments.id, comments.user_id, comments.event_id, comments.rating, comments.comment, comments.timestamp, users.email
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.event_id = $1
      `,
      [event_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "No comments found" });
    }

    const comments = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      event_id: row.event_id,
      rating: row.rating,
      comment: row.comment,
      timestamp: row.timestamp,
      email: row.email,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, event_id, rating, comment, timestamp } = body;

    if (!timestamp || !user_id || !event_id || rating === undefined || !comment) {
      console.error("Missing required fields:", body);
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `
      WITH inserted_comment AS (
        INSERT INTO comments (user_id, event_id, rating, comment, timestamp)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
      SELECT ic.id, ic.user_id, ic.event_id, ic.rating, ic.comment, ic.timestamp, u.email
      FROM inserted_comment ic
      JOIN users u ON ic.user_id = u.id
      `,
      [user_id, event_id, rating, comment, timestamp]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Failed to insert rating:", error);
    return NextResponse.json(
      { message: "Failed to insert rating" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const comment_id = searchParams.get("comment_id");

  if (!comment_id) {
    return NextResponse.json(
      { error: "Missing comment_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM comments WHERE id = $1",
      [comment_id]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { message: "No comment found with that ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_id, new_comment } = body;

    if (!comment_id || !new_comment) {
      return NextResponse.json(
        { error: "Missing comment_id or new_comment in request body" },
        { status: 400 }
      );
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *",
      [new_comment, comment_id]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { message: "No comment found with that ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}