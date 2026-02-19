import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM vw_payment_mix ORDER BY total_amount DESC"
        );

        return NextResponse.json(result.rows);
    } catch {
        return NextResponse.json(
            { error: "Error fetching payment mix data" },
            { status: 500 }
        );
    }
}
