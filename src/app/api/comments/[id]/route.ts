import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id query parameter" },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    "SELECT id FROM comments WHERE user_id = $1",
    [user_id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ message: "No comments found" });
  }

  return NextResponse.json(rows);
}
