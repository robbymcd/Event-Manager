import { NextResponse } from "next/server";
import pool from "@/lib/db";

// this is a temp api just to see the users adn make sure teh connection is working

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM users");
  return NextResponse.json(rows);
}
