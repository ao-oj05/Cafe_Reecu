import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
        const rawSearch = searchParams.get("search") || "";
        const search = rawSearch.replace(/[^\w\s]/gi, "").trim();
        const offset = (page - 1) * limit;

        // Log para ver columnas reales de la view (quitar despues)
        const colCheck = await pool.query(
            "SELECT * FROM vw_top_products_ranked LIMIT 1"
        );
        console.log("Columnas de vw_top_products_ranked:", Object.keys(colCheck.rows[0] ?? {}));

        const params: (string | number)[] = [];
        let whereClause = "";

        if (search) {
            // Busca en nombre_producto con ILIKE parcial
            // Si el log muestra otro nombre de columna, cambialo aqui
            params.push(`%${search}%`);
            whereClause = `WHERE nombre_producto ILIKE $1`;
        }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM vw_top_products_ranked ${whereClause}`,
            params
        );
        const total = Number(countResult.rows[0].count);

        params.push(limit, offset);
        const dataResult = await pool.query(
            `SELECT *
             FROM vw_top_products_ranked
             ${whereClause}
             ORDER BY rank_revenue
             LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return NextResponse.json({
            data:       dataResult.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            search:     search || null,
        });
    } catch (error) {
        console.error("Error en top-products:", error);
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}