import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {  
    const { email, password, role, university, uniDesc, uniLoc, uniStudents, rso, rsoDesc, rsoCat} = await req.json();
  
    const hashedPassword = await bcrypt.hash(password, 10);

    let userId, rsoId, uniId, res;

    // fetch university id by name if it exists
    const existingUni = await pool.query(
      "SELECT id FROM university WHERE name = $1",
      [university]
    );

    if (existingUni.rows.length > 0) {
      uniId = existingUni.rows[0].id;
    }

    if (role == "student") {

      // Check if the university exists
      if (!uniId) {
        throw new Error("University not found. Admin must belong to a valid university.");
      }

      res = await pool.query(
        "INSERT INTO users (email, password, university, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, hashedPassword, uniId, role]
      );

    } else if (role == "admin") {
      
      // Check if the university exists
      if (!uniId) {
        throw new Error("University not found. Admin must belong to a valid university.");
      }

      // create the Rso
      const rsoRes = await pool.query(
        "INSERT INTO rso (name, university, description, category) VALUES ($1, $2, $3, $4) RETURNING id",
        [rso, uniId, rsoDesc, rsoCat]
      );

      rsoId = rsoRes.rows[0].id;

      res = await pool.query(
        "INSERT INTO users (email, password, role, university, rso) VALUES ($1, $2, $3, $4, ARRAY[$5]) RETURNING *",
        [email, hashedPassword, role, uniId, rsoId]
      )
    } else { // role == 'super-admin'
      
      // create the University
      const uniRes = await pool.query(
        "INSERT INTO university (name, location, description, numstudent) VALUES ($1, $2, $3, $4) RETURNING id",
        [university, uniLoc, uniDesc, uniStudents]
      )

      uniId = uniRes.rows[0].id;
  
      res = await pool.query(
        "INSERT INTO users (email, password, role, university) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, hashedPassword, role, uniId]
      );
    }
    userId = res.rows[0].id;
    return NextResponse.json({
      id: userId,
      email, 
      role,
      university: uniId,
      rso: rsoId || null,
    });
  } catch (error) {
    console.log("Error during registration:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
