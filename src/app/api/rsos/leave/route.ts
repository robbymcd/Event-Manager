import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { userId, rsos } = await req.json();

        if (!userId || !Array.isArray(rsos) || rsos.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid data" },
                { status: 400 }
            );
        }

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

        const currentRsos = userRes.rows[0].rso || [];
        
        // Filter out RSOs that need to be removed
        const updatedRsos = currentRsos.filter(
            id => !rsos.some(rsoToRemove => String(rsoToRemove) === String(id))
        );

        await pool.query(
            "UPDATE users SET rso = $1 WHERE id = $2",
            [updatedRsos, userId]
        );

        return NextResponse.json({
            message: "Successfully left RSOs",
            rso: updatedRsos,
        });
    } catch (error) {
        console.error("Error leaving RSOs:", error);
        return NextResponse.json(
            { error: "Failed to leave RSOs" },
            { status: 500 }
        );
    }
}