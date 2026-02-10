import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        s.roll_number,
        p.problem_number,
        p.allocated_count,
        p.capacity
      FROM students s
      JOIN problems p ON s.problem_id = p.id
      ORDER BY p.problem_number;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch allocations" },
      { status: 500 }
    );
  }
}
