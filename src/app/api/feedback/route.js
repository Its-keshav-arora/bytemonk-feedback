import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM feedbacks ORDER BY id DESC LIMIT 5"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, course, rating, howHeard, message } = data;

    const result = await pool.query(
      "INSERT INTO feedbacks (name, email, message, course, rating, howheard) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, message, course, rating, howHeard]
    );

    const latest = await pool.query(
      "SELECT * FROM feedbacks ORDER BY id DESC LIMIT 5"
    );

    return NextResponse.json(latest.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
