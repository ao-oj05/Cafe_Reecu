import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

const ALLOWED_CATEGORIES = ["1", "2", "3", "4"];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category_id = searchParams.get("category_id") || null;

        if (category_id && !ALLOWED_CATEGORIES.includes(category_id)) {
            return NextResponse.json(
                { error: "Categoría inválida. Valores permitidos: 1, 2, 3, 4" },
                { status: 400 }
            );
        }

        let sql = "SELECT * FROM vw_inventory_risk WHERE 1=1";
        const params: number[] = [];

        if (category_id) {
            params.push(parseInt(category_id));
            sql += ` AND category_id = $${params.length}`;
        }

        sql += " ORDER BY nivel_riesgo DESC NULLS LAST";

        const result = await pool.query(sql, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error en inventory-risk:", error);
        return NextResponse.json(
            { error: "Error al obtener inventario en riesgo" },
            { status: 500 }
        );
    }
}