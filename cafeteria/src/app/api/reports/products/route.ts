import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? "";
        const page = Number(searchParams.get("page") ?? 1);
        const limit = Number(searchParams.get("limit") ?? 5);

        const offset = (page - 1) * limit;


        const dataQuery = await pool.query(
            `
      SELECT product_name, total_vendido, revenue, ranking
      FROM vw_top_products_ranked
      WHERE product_name ILIKE $1
      ORDER BY revenue DESC
      LIMIT $2 OFFSET $3
      `,
            [`%${search}%`, limit, offset]
        );


        const countQuery = await pool.query(
            `
      SELECT COUNT(*) 
      FROM vw_top_products_ranked
      WHERE product_name ILIKE $1
      `,
            [`%${search}%`]
        );

        const total = Number(countQuery.rows[0].count);

        return NextResponse.json({
            data: dataQuery.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error("Error in products API:", error);

        return NextResponse.json(
            { error: "Error fetching products" },
            { status: 500 }
        );
    }
}
