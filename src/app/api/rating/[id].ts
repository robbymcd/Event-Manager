import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { rating, comment } = await req.json();

  const res = await pool.query(
    "UPDATE ratings SET rating = $1, comment = $2 WHERE id = $3 RETURNING *",
    [rating, comment, params.id]
  );

  return NextResponse.json(res.rows[0]);
}

export async function DELETE({ params }: { params: { id: string } }) {
  await pool.query("DELETE FROM ratings WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Rating deleted successfully" });
}
