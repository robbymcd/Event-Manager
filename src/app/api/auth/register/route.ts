import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {  
    const { email, password, role, university, uniDesc, uniLoc, uniStudents, rso, rsoUniversity, rsoDesc, rsoCat} = await req.json();
  
    const hashedPassword = await bcrypt.hash(password, 10);

    let userId, rsoId, uniId;

    // fetch university id by name if it exists
    const existingUni = await pool.query(
      "SELECT id FROM university WHERE name = $1",
      [university]
    );

    if (existingUni.rows.length > 0) {
      uniId = existingUni.rows[0].id;
    }

    if (role == "student") {
      const res = await pool.query(
        "INSERT INTO users (email, password, university, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, hashedPassword, university, role]
      );
      userId = res.rows[0].id;

    } else if (role == "admin") {
      
      // create the Rso
      const rsoRes = await pool.query(
        "INSERT INTO rso (name, university, description, category) VALUES ($1, $2, $3, $4) RETURNING id",
        [rso, rsoUniversity, rsoDesc, rsoCat]
      );

      rsoId = rsoRes.rows[0].id;

      const res = await pool.query(
        "INSERT INTO users (email, password, university, role, rso, rsoDesc, rsoCat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [email, hashedPassword, role, university, rsoId]
      )
    
    } else if (role == "super-admin") {
      
      // create the University
      const uniRes = await pool.query(
        "INSERT INTO university (name, location, description, students) VALUES ($1, $2, $3, $4) RETURNING id",
        [university, uniLoc, uniDesc, uniStudents]
      )

      uniId = uniRes.rows[0].id;
  
      const res = await pool.query(
        "INSERT INTO users (email, password, role, university, rso) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, role, uniId, rso]
      );
    }
    return NextResponse.json({
      id: userId,
      email, 
      role,
      university: uniId,
      rso: rsoId
    });
  } catch (error) {
    console.log("Error during registration:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
