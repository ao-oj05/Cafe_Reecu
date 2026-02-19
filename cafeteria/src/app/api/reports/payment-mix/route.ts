import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM vw_payment_mix ORDER BY total_recaudado DESC"
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error en payment-mix:", error);
        return NextResponse.json(
            { error: "Error al obtener mix de pagos" },
            { status: 500 }
        );
    }
}