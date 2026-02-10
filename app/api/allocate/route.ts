import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { roll } = await req.json();

    if (!roll) {
      return NextResponse.json(
        { error: "Roll number is required." },
        { status: 400 }
      );
    }

    // Normalize input
    const normalizedRoll = roll.trim().toUpperCase();

    const result = await pool.query(
      "SELECT allocate_problem($1) AS problem_number",
      [normalizedRoll]
    );

    return NextResponse.json({
      success: true,
      problemNumber: result.rows[0].problem_number,
    });

  } catch (error: any) {

    // Duplicate roll
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This roll number has already been registered." },
        { status: 400 }
      );
    }

    // Format constraint violation
    if (error.code === "23514" && error.constraint === "roll_format_check") {
      return NextResponse.json(
        {
          error:
            "Roll number format is incorrect. Expected format: CH.SC.U4CSE240XX.",
        },
        { status: 400 }
      );
    }

    // Capacity full
    if (error.message?.includes("fully allocated")) {
      return NextResponse.json(
        { error: "All problems have been fully allocated." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Allocation failed. Contact faculty." },
      { status: 500 }
    );
  }
}
