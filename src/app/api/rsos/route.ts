import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM rso");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, university } = await req.json();

  const res = await pool.query(
    "INSERT INTO rso (name, university) VALUES ($1, $2) RETURNING *",
    [name, university]
  );

  return NextResponse.json(res.rows[0]);
}
