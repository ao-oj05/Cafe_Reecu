import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
        const offset = (page - 1) * limit;

        // Total de filas para calcular páginas
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM vw_customer_value"
        );
        const total = parseInt(countResult.rows[0].count);

        // Consulta paginada — solo SELECT sobre VIEW
        const result = await pool.query(
            `SELECT
                customer_id,
                nombre_cliente   AS customer_name,
                email            AS customer_email,
                num_ordenes,
                total_gastado,
                gasto_promedio_orden AS gasto_promedio,
                ultima_compra,
                segmento_cliente AS estado_cliente
             FROM vw_customer_value
             ORDER BY total_gastado DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return NextResponse.json({
            data:       result.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching customer value:", error);
        return NextResponse.json(
            { error: "Error al obtener datos de clientes" },
            { status: 500 }
        );
    }
}