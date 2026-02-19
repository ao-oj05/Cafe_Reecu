import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM vw_inventory_risk ORDER BY risk_level DESC"
        );

        return NextResponse.json(result.rows);
    } catch {
        return NextResponse.json(
            { error: "Error fetching inventory data" },
            { status: 500 }
        );
    }
}
