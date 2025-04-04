import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET({ params }: { params: { id: string } }) {
  const { rows } = await pool.query("SELECT * FROM rsos WHERE id = $1", [
    params.id,
  ]);
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name, university } = await req.json();

  const res = await pool.query(
    "UPDATE rsos SET name = $1, university = $2 WHERE id = $3 RETURNING *",
    [name, university, params.id]
  );

  return NextResponse.json(res.rows[0]);
}

export async function DELETE({ params }: { params: { id: string } }) {
  await pool.query("DELETE FROM rsos WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "RSO deleted successfully" });
}
