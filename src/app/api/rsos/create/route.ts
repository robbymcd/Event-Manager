import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { rsoName, rsoDesc, rsoCat, universityId, userId } = await req.json();

    if (!rsoName || !rsoDesc || !rsoCat || !universityId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rsoResult = await pool.query(
      `INSERT INTO rso (name, description, category, university)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [rsoName, rsoDesc, rsoCat, universityId]
    );

    const rsoId = rsoResult.rows[0].id;

    const userRes = await pool.query(
      "SELECT rso FROM users WHERE id = $1",
      [userId]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingRsos: number[] = userRes.rows[0].rso || [];
    const updatedRsos = Array.from(new Set([...existingRsos, rsoId]));

    await pool.query(
      "UPDATE users SET role = $1, rso = $2 WHERE id = $3",
      ["admin", updatedRsos, userId]
    );

    return NextResponse.json({
      message: "RSO created and user promoted to admin",
      rsoId,
      newRole: "admin",
    });
  } catch (error) {
    console.error("Error creating RSO:", error);
    return NextResponse.json(
      { error: "Failed to create RSO" },
      { status: 500 }
    );
  }
}
