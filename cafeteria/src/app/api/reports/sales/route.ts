import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date_from = searchParams.get("date_from") || null;
        const date_to = searchParams.get("date_to") || null;

        if (date_from && !DATE_REGEX.test(date_from)) {
            return NextResponse.json(
                { error: "Formato invalido en date_from. Use YYYY-MM-DD" },
                { status: 400 }
            );
        }
        if (date_to && !DATE_REGEX.test(date_to)) {
            return NextResponse.json(
                { error: "Formato invalido en date_to. Use YYYY-MM-DD" },
                { status: 400 }
            );
        }

        let sql = "SELECT * FROM vw_sales_daily WHERE 1=1";
        const params: string[] = [];

        if (date_from) {
            params.push(date_from);
            sql += ` AND sale_date >= $${params.length}`;
        }
        if (date_to) {
            params.push(date_to);
            sql += ` AND sale_date <= $${params.length}`;
        }

        sql += " ORDER BY sale_date DESC";

        const result = await pool.query(sql, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error en sales-daily:", error);
        return NextResponse.json(
            { error: "Error al obtener ventas diarias" },
            { status: 500 }
        );
    }
}
