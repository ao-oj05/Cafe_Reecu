import { headers } from "next/headers";
import Link from "next/link";

type CustomerValueRow = {
    customer_id: number;
    customer_name: string;
    customer_email: string;
    num_ordenes: number;
    total_gastado: string;
    gasto_promedio: string;
    ultima_compra: string;
    estado_cliente: string;
};

type ApiResponse = {
    data: CustomerValueRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

function formatDate(dateString: string): string {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace('.', '');
}

async function getCustomerValue(page = 1, limit = 10): Promise<ApiResponse> {
    const host = (await headers()).get("host");
    const res = await fetch(`http://${host}/api/reports/customers?page=${page}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener clientes");
    return res.json();
}

export default async function CustomersReport({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "10");
    const response = await getCustomerValue(page, limit);
    const top = response.data[0];

    const totalGastadoNum = response.data.reduce((s, r) => s + Number(r.total_gastado), 0);
    const avgGasto = response.data.length > 0
        ? (totalGastadoNum / response.data.length).toLocaleString("en-US", { minimumFractionDigits: 2 })
        : "0.00";

    return (
        <div className="min-h-screen bg-black text-lilac-100 p-10 bg-gradient-to-br from-black via-purple-950 to-black">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-10 border-b border-lilac-800 pb-6">
                    <p className="text-xs tracking-widest uppercase text-lilac-400 mb-2">
                        Cafetería - Analítica
                    </p>
                    <h1 className="text-4xl font-bold text-lilac-200">
                        Valor de Clientes
                    </h1>
                    <p className="text-lilac-400 text-sm mt-2">
                        Segmentación y lifetime value por comportamiento de compra.
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-lilac-950 border border-lilac-800 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Cliente Estrella
                        </p>
                        <p className="text-2xl font-semibold text-lilac-200 truncate">
                            {top?.customer_name ?? "-"}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            ${Number(top?.total_gastado || 0).toLocaleString()} acumulado
                        </p>
                    </div>

                    <div className="bg-purple-900/40 border border-purple-700 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Gasto Promedio
                        </p>
                        <p className="text-2xl font-semibold text-purple-200">
                            ${avgGasto}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            por cliente en esta página
                        </p>
                    </div>

                    <div className="bg-lilac-950 border border-lilac-800 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Total Clientes
                        </p>
                        <p className="text-2xl font-semibold text-lilac-200">
                            {response.total}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            con al menos 1 orden
                        </p>
                    </div>
                </div>

                {/* TABLA */}
                <div className="overflow-x-auto border border-lilac-800 rounded-xl">
                    <table className="min-w-full text-sm">
                        <thead className="bg-lilac-900 text-lilac-300 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Cliente</th>
                                <th className="px-6 py-4 text-center">Órdenes</th>
                                <th className="px-6 py-4 text-right">Total Gastado</th>
                                <th className="px-6 py-4 text-right">Gasto Prom.</th>
                                <th className="px-6 py-4 text-center">Última Compra</th>
                                <th className="px-6 py-4 text-right">Segmento</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-lilac-900">
                            {response.data.map((row) => (
                                <tr key={row.customer_id} className="hover:bg-lilac-950 transition">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-lilac-200">{row.customer_name}</div>
                                        <div className="text-xs text-lilac-500 mt-0.5">{row.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-lilac-300 tabular-nums">
                                        {row.num_ordenes}
                                    </td>
                                    <td className="px-6 py-4 text-right text-purple-300 tabular-nums">
                                        ${Number(row.total_gastado).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-right text-lilac-400 tabular-nums">
                                        ${Number(row.gasto_promedio).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-lilac-500 tracking-wide">
                                        {formatDate(row.ultima_compra)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-3 py-1 rounded-full text-xs bg-purple-800 text-purple-200 font-medium uppercase tracking-wide">
                                            {row.estado_cliente || 'VIP'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                <footer className="mt-10 flex justify-center items-center gap-6">
                    <Link
                        href={`?page=${Math.max(1, page - 1)}&limit=${limit}`}
                        className={`text-xs uppercase tracking-widest px-6 py-2 border border-lilac-800 rounded-full hover:border-lilac-500 hover:text-lilac-200 transition-all ${page <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        Anterior
                    </Link>
                    <span className="text-xs text-lilac-500 tracking-widest uppercase">
                        Página {page} <span className="text-lilac-800 mx-2">|</span> {response.totalPages}
                    </span>
                    <Link
                        href={`?page=${Math.min(response.totalPages, page + 1)}&limit=${limit}`}
                        className={`text-xs uppercase tracking-widest px-6 py-2 border border-lilac-800 rounded-full hover:border-lilac-500 hover:text-lilac-200 transition-all ${page >= response.totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        Siguiente
                    </Link>
                </footer>

            </div>
        </div>
    );
}