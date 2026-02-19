import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM vw_customers_value ORDER BY total_spent DESC"
        );

        return NextResponse.json(result.rows);
    } catch {
        return NextResponse.json(
            { error: "Error fetching customers data" },
            { status: 500 }
        );
    }
}
