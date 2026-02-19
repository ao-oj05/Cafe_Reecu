import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM vw_sales_daily ORDER BY sale_date DESC LIMIT 10"
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching sales data" },
            { status: 500 }
        );
    }
}
