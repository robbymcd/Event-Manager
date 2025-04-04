import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE({ params }: { params: { id: string } }) {
  await pool.query("DELETE FROM event_participants WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Participant removed successfully" });
}
