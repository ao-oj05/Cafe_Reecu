import { headers } from "next/headers";
import Link from "next/link";

type InventoryRow = {
    product_id: number;
    nombre_producto: string;
    category_id: number;
    categoria: string;
    stock_actual: number;
    stock_promedio_categoria: string;
    pct_vs_promedio_cat: string;
    nivel_riesgo: string;
};

async function getInventoryRisk(category_id?: string): Promise<InventoryRow[]> {
    const headersList = await headers();
    const host = headersList.get("host");
    const url = category_id
        ? `http://${host}/api/reports/inventory?category_id=${category_id}`
        : `http://${host}/api/reports/inventory`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener inventario en riesgo");
    return res.json();
}

const CATEGORIAS = [
    { id: "1", nombre: "Bebidas" },
    { id: "2", nombre: "Postres" },
    { id: "3", nombre: "Alimentos" },
    { id: "4", nombre: "Snacks" },
];

export default async function InventoryReport({
                                                  searchParams,
                                              }: {
    searchParams: Promise<{ category_id?: string }>;
}) {
    const params = await searchParams;
    const data = await getInventoryRisk(params.category_id);

    const criticos = data.filter(
        r => r.nivel_riesgo === "CRÍTICO" || r.nivel_riesgo === "SIN STOCK"
    ).length;

    const sinStock = data.filter(
        r => r.nivel_riesgo === "SIN STOCK"
    ).length;

    return (
        <div className="min-h-screen bg-black text-lilac-100 p-10 bg-gradient-to-br from-black via-purple-950 to-black">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-lilac-200">
                        Inventario en Riesgo
                    </h1>
                    <p className="text-sm text-purple-300 mt-2">
                        Productos con bajo stock y alertas activas
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-purple-900/40 border border-purple-700 rounded-xl p-6">
                        <p className="text-xs uppercase text-purple-400 mb-2">
                            Productos en Riesgo
                        </p>
                        <p className="text-2xl font-semibold text-purple-200">
                            {criticos}
                        </p>
                    </div>

                    <div className="bg-purple-900/40 border border-purple-700 rounded-xl p-6">
                        <p className="text-xs uppercase text-purple-400 mb-2">
                            Sin Stock
                        </p>
                        <p className="text-2xl font-semibold text-purple-200">
                            {sinStock}
                        </p>
                    </div>

                    <div className="bg-purple-900/40 border border-purple-700 rounded-xl p-6">
                        <p className="text-xs uppercase text-purple-400 mb-2">
                            Total Productos
                        </p>
                        <p className="text-2xl font-semibold text-purple-200">
                            {data.length}
                        </p>
                    </div>
                </div>

                {/* FILTRO */}
                <form method="get" className="flex gap-4 items-end mb-8">
                    <div>
                        <label className="block text-xs text-purple-400 mb-2">
                            Categoría
                        </label>
                        <select
                            name="category_id"
                            defaultValue={params.category_id || ""}
                            className="bg-black border border-purple-700 rounded-lg px-4 py-2 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="">Todas</option>
                            {CATEGORIAS.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-600 px-5 py-2 rounded-lg text-white text-sm transition"
                    >
                        Filtrar
                    </button>

                    <Link
                        href="/reports/inventory"
                        className="text-purple-400 text-sm hover:underline"
                    >
                        Limpiar
                    </Link>
                </form>

                {/* TABLA */}
                <div className="bg-purple-950/40 border border-purple-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-purple-900/50 text-purple-300 text-xs uppercase">
                        <tr>
                            <th className="text-left px-6 py-4">Producto</th>
                            <th className="text-left px-6 py-4">Categoría</th>
                            <th className="text-right px-6 py-4">Stock</th>
                            <th className="text-right px-6 py-4">Prom. Cat.</th>
                            <th className="text-right px-6 py-4">% vs Prom.</th>
                            <th className="text-center px-6 py-4">Riesgo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.product_id}
                                className="border-t border-purple-900 hover:bg-purple-900/30 transition"
                            >
                                <td className="px-6 py-4 text-purple-100">
                                    {row.nombre_producto}
                                </td>
                                <td className="px-6 py-4 text-purple-400">
                                    {row.categoria}
                                </td>
                                <td className="px-6 py-4 text-right text-purple-200">
                                    {row.stock_actual}
                                </td>
                                <td className="px-6 py-4 text-right text-purple-300">
                                    {Number(row.stock_promedio_categoria).toFixed(1)}
                                </td>
                                <td className="px-6 py-4 text-right text-purple-400">
                                    {Number(row.pct_vs_promedio_cat).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full text-xs bg-purple-800 text-purple-200">
                                            {row.nivel_riesgo}
                                        </span>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-10 text-purple-500"
                                >
                                    No hay productos en riesgo.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
