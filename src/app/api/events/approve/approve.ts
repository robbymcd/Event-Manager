import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const { eventIds } = await req.json();

  if (!Array.isArray(eventIds) || eventIds.length === 0) {
    return NextResponse.json({ error: "Invalid event IDs" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE events SET approved = TRUE WHERE id = ANY($1::int[]) RETURNING *",
      [eventIds]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "No events were updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Events approved successfully", events: rows });
  } catch (error) {
    console.error("Error approving events:", error);
    return NextResponse.json({ error: "Failed to approve events" }, { status: 500 });
  }
}
