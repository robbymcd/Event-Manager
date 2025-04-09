import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const userId = body.userId;
        const rsoId = body.rsoId.toString(); // Convert to string to match TEXT[] type in database

        console.log("Received request:", { userId, rsoId });

        if (!userId || !rsoId) {
            return NextResponse.json({ error: "User ID and RSO ID are required" }, { status: 400 });
        }

        // First, let's check if the user exists and get their current RSOs
        const userQuery = `SELECT rso FROM users WHERE id = $1`;
        console.log("Running user query:", userQuery, "with params:", [userId]);
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Log the current RSO array for debugging
        const currentRsos = userResult.rows[0].rso || [];
        console.log("Current RSOs:", currentRsos, "Looking for:", rsoId, "Type:", typeof rsoId);
        
        // Check membership more carefully with type-safe comparison
        const isMember = currentRsos.some(id => String(id) === String(rsoId));
        if (!isMember) {
            return NextResponse.json({ 
                error: "User is not a member of this RSO",
                currentRsos: currentRsos 
            }, { status: 403 });
        }

        // Now remove the RSO from the user's list
        const leaveQuery = `UPDATE users SET rso = array_remove(rso, $1) WHERE id = $2 RETURNING rso`;
        console.log("Running leave query:", leaveQuery, "with params:", [rsoId, userId]);
        const leaveResult = await pool.query(leaveQuery, [rsoId, userId]);
        
        // Get the updated RSO list from the database
        const updatedRsos = leaveResult.rows[0]?.rso || [];

        return NextResponse.json({ 
            message: "Successfully left the RSO",
            rso: updatedRsos
        });
    } catch (error) {
        console.error("Error leaving RSO:", error);
        // More detailed error information
        return NextResponse.json(
            { 
                error: "Failed to leave RSO", 
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}