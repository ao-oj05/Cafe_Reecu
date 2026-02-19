import { headers } from "next/headers";
import Link from "next/link";

type ProductRow = {
    product_id: number;
    nombre_producto: string;
    categoria: string;
    precio_unitario: string;
    total_unidades: number;
    total_revenue: string;
    precio_promedio_venta: string;
    rank_revenue: number;
    rank_unidades: number;
};

type ApiResponse = {
    data: ProductRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    search: string | null;
};

async function getProducts(search: string, page: number, limit: number): Promise<ApiResponse> {
    const headersList = await headers();
    const host = headersList.get("host");
    const url = `http://${host}/api/reports/products?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json();
}

export default async function ProductsReport({
                                                 searchParams,
                                             }: {
    searchParams: Promise<{ search?: string; page?: string }>;
}) {
    const params   = await searchParams;
    const search   = params.search ?? "";
    const page     = Math.max(1, parseInt(params.page ?? "1"));
    const limit    = 10;

    const response = await getProducts(search, page, limit);
    const top      = response.data[0];

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* HEADER */}
                <div className="border-b border-purple-900 pb-6">
                    <p className="text-xs uppercase tracking-widest text-purple-400 mb-2">
                        Reportes · Analítica
                    </p>
                    <h1 className="text-3xl font-bold text-purple-300">
                        Top Productos
                        {search && (
                            <span className="ml-3 text-sm bg-purple-900/40 border border-purple-700 px-2 py-1 rounded">
                                "{search}"
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Ranking por revenue y unidades vendidas
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Producto #1
                        </p>
                        <p className="text-lg font-semibold text-purple-300">
                            {top?.nombre_producto ?? "-"}
                        </p>
                        <p className="text-sm text-gray-400">
                            {top?.categoria ?? ""}
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Mayor Revenue
                        </p>
                        <p className="text-lg font-semibold text-purple-300">
                            $
                            {top
                                ? Number(top.total_revenue).toLocaleString("es-MX", {
                                    minimumFractionDigits: 2,
                                })
                                : "0.00"}
                        </p>
                        <p className="text-sm text-gray-400">
                            {top?.total_unidades ?? 0} unidades vendidas
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Total Resultados
                        </p>
                        <p className="text-lg font-semibold text-purple-300">
                            {response.total}
                        </p>
                        <p className="text-sm text-gray-400">
                            productos encontrados
                        </p>
                    </div>
                </div>

                {/* SEARCH */}
                <form method="GET" className="flex gap-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar producto..."
                        defaultValue={search}
                        className="flex-1 bg-zinc-900 border border-purple-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-600 px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Buscar
                    </button>
                    {search && (
                        <Link
                            href="/reports/products"
                            className="border border-purple-900 px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition"
                        >
                            Limpiar
                        </Link>
                    )}
                </form>

                {/* TABLE */}
                <div className="bg-zinc-900 border border-purple-900 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-purple-950 text-purple-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-3 text-center">#</th>
                            <th className="p-3 text-left">Producto</th>
                            <th className="p-3 text-left">Categoría</th>
                            <th className="p-3 text-right">Unidades</th>
                            <th className="p-3 text-right">Revenue</th>
                            <th className="p-3 text-right">Precio Prom.</th>
                            <th className="p-3 text-center">Rank Unidades</th>
                        </tr>
                        </thead>
                        <tbody>
                        {response.data.map((row) => {
                            const rankColor =
                                row.rank_revenue === 1
                                    ? "bg-purple-600"
                                    : row.rank_revenue === 2
                                        ? "bg-purple-700"
                                        : row.rank_revenue === 3
                                            ? "bg-purple-800"
                                            : "bg-zinc-700";

                            return (
                                <tr
                                    key={row.product_id}
                                    className="border-t border-zinc-800 hover:bg-zinc-800/60 transition"
                                >
                                    <td className="p-3 text-center">
                                            <span
                                                className={`w-7 h-7 text-xs flex items-center justify-center rounded-full ${rankColor}`}
                                            >
                                                {row.rank_revenue}
                                            </span>
                                    </td>
                                    <td className="p-3 text-purple-300 font-medium">
                                        {row.nombre_producto}
                                    </td>
                                    <td className="p-3 text-gray-400">
                                        {row.categoria}
                                    </td>
                                    <td className="p-3 text-right">
                                        {row.total_unidades}
                                    </td>
                                    <td className="p-3 text-right text-purple-400 font-semibold">
                                        $
                                        {Number(row.total_revenue).toLocaleString("es-MX", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="p-3 text-right">
                                        ${Number(row.precio_promedio_venta).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-center text-gray-400">
                                        {row.rank_unidades}
                                    </td>
                                </tr>
                            );
                        })}

                        {response.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No se encontraron productos
                                    {search ? ` para "${search}"` : ""}.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center items-center gap-6">
                    {page > 1 && (
                        <Link
                            href={`?search=${search}&page=${page - 1}`}
                            className="px-4 py-2 border border-purple-900 rounded-lg text-sm hover:bg-zinc-800 transition"
                        >
                            Anterior
                        </Link>
                    )}

                    <span className="text-sm text-gray-400">
                        Página <span className="text-purple-300">{page}</span> de{" "}
                        <span className="text-purple-300">
                            {response.totalPages}
                        </span>
                    </span>

                    {page < response.totalPages && (
                        <Link
                            href={`?search=${search}&page=${page + 1}`}
                            className="px-4 py-2 border border-purple-900 rounded-lg text-sm hover:bg-zinc-800 transition"
                        >
                            Siguiente
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
