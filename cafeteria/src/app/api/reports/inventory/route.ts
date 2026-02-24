import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

const ALLOWED_CATEGORIES = ["1", "2", "3", "4"];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category_id = searchParams.get("category_id") || null;

        // Parámetros de paginación
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;

        if (category_id && !ALLOWED_CATEGORIES.includes(category_id)) {
            return NextResponse.json(
                { error: "Categoría inválida. Valores permitidos: 1, 2, 3, 4" },
                { status: 400 }
            );
        }

        let whereClause = " WHERE 1=1";
        // Definimos el tipo explícitamente para evitar el error de ESLint
        const params: (string | number)[] = [];

        if (category_id) {
            params.push(parseInt(category_id));
            whereClause += ` AND category_id = $${params.length}`;
        }

        // 1. Obtener el total para el conteo de páginas
        const countResult = await pool.query(`SELECT COUNT(*) FROM vw_inventory_risk ${whereClause}`, params);
        const totalRecords = parseInt(countResult.rows[0].count);

        // 2. Obtener los datos paginados
        let sql = `SELECT * FROM vw_inventory_risk ${whereClause}`;
        sql += " ORDER BY nivel_riesgo DESC NULLS LAST";

        const queryParams: (string | number)[] = [...params, limit, offset];
        sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        const result = await pool.query(sql, queryParams);

        return NextResponse.json({
            data: result.rows,
            pagination: {
                total: totalRecords,
                page,
                limit,
                totalPages: Math.ceil(totalRecords / limit)
            }
        });
    } catch (error) {
        console.error("Error en inventory-risk:", error);
        return NextResponse.json(
            { error: "Error al obtener inventario en riesgo" },
            { status: 500 }
        );
    }
}