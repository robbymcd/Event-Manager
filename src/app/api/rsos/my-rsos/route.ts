import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userQuery = `SELECT rso FROM users WHERE id = $1`;
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0 || !userResult.rows[0].rso || userResult.rows[0].rso.length === 0) {
        return NextResponse.json([]);
    }

    const rsoIds = userResult.rows[0].rso;

    const rsoQuery = `SELECT id, name, description, category FROM rso WHERE id = ANY($1)`;
    const rsoResult = await pool.query(rsoQuery, [rsoIds]);

    return NextResponse.json(rsoResult.rows);
  }