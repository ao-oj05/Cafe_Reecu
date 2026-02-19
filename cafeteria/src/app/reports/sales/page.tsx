import { headers } from "next/headers";
import Link from "next/link";

type SalesRow = {
    sale_date: string;
    tickets: number;
    total_ventas: string;
    ticket_promedio: string;
    ventas_presencial: string;
    ventas_digital: string;
    pct_ventas_digital: string;
};

function formatDate(dateString: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

async function getSalesDaily(date_from?: string, date_to?: string): Promise<SalesRow[]> {
    const headersList = await headers();
    const host = headersList.get("host");
    const params = new URLSearchParams();
    if (date_from) params.set("date_from", date_from);
    if (date_to) params.set("date_to", date_to);

    const url = `http://${host}/api/reports/sales${params.toString() ? "?" + params.toString() : ""}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error("Error al obtener ventas diarias");
    return res.json();
}

export default async function SalesReport({
                                              searchParams,
                                          }: {
    searchParams: Promise<{ date_from?: string; date_to?: string }>;
}) {
    const params = await searchParams;
    const data = await getSalesDaily(params.date_from, params.date_to);

    const totalVentas = data.reduce((sum, r) => sum + Number(r.total_ventas), 0);
    const totalTickets = data.reduce((sum, r) => sum + Number(r.tickets), 0);
    const ticketProm = totalTickets > 0 ? totalVentas / totalTickets : 0;

    return (
        <div className="min-h-screen bg-black text-lilac-100 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-10 border-b border-lilac-800 pb-6">
                    <p className="text-xs tracking-widest uppercase text-lilac-400 mb-2">
                        Cafetería - Analítica
                    </p>
                    <h1 className="text-4xl font-bold text-lilac-200">
                        Ventas Diarias
                    </h1>
                    <p className="text-lilac-400 text-sm mt-2">
                        Desempeño diario de ventas y canales
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-lilac-950 border border-lilac-800 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Total Ventas
                        </p>
                        <p className="text-2xl font-semibold text-lilac-200">
                            ${totalVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            {data.length} días con ventas
                        </p>
                    </div>

                    <div className="bg-lilac-950 border border-lilac-800 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Total Tickets
                        </p>
                        <p className="text-2xl font-semibold text-lilac-200">
                            {totalTickets}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            órdenes completadas
                        </p>
                    </div>

                    <div className="bg-lilac-950 border border-lilac-800 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-lilac-400 mb-2">
                            Ticket Promedio
                        </p>
                        <p className="text-2xl font-semibold text-lilac-200">
                            ${ticketProm.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-lilac-500 mt-1">
                            por orden
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <form method="get" className="flex flex-wrap items-end gap-4 mb-8 bg-lilac-950 border border-lilac-800 p-6 rounded-xl">
                    <div>
                        <label className="block text-xs uppercase text-lilac-400 mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            name="date_from"
                            defaultValue={params.date_from || ""}
                            className="bg-black border border-lilac-700 text-lilac-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lilac-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-lilac-400 mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            name="date_to"
                            defaultValue={params.date_to || ""}
                            className="bg-black border border-lilac-700 text-lilac-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lilac-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-lilac-600 hover:bg-lilac-500 text-black font-medium px-5 py-2 rounded-lg transition"
                    >
                        Filtrar
                    </button>

                    <Link
                        href="/reports/sales"
                        className="border border-lilac-700 text-lilac-300 px-5 py-2 rounded-lg hover:bg-lilac-900 transition"
                    >
                        Limpiar
                    </Link>
                </form>

                {/* Tabla */}
                <div className="overflow-x-auto border border-lilac-800 rounded-xl">
                    <table className="min-w-full text-sm">
                        <thead className="bg-lilac-900 text-lilac-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-right">Tickets</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-right">Promedio</th>
                            <th className="px-4 py-3 text-right">Presencial</th>
                            <th className="px-4 py-3 text-right">Digital</th>
                            <th className="px-4 py-3 text-right">% Digital</th>
                        </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-lilac-900">
                        {data.map((row) => {
                            const pct = Number(row.pct_ventas_digital);
                            return (
                                <tr key={row.sale_date} className="hover:bg-lilac-950 transition">
                                    <td className="px-4 py-3 text-lilac-200">
                                        {formatDate(row.sale_date)}
                                    </td>
                                    <td className="px-4 py-3 text-right">{row.tickets}</td>
                                    <td className="px-4 py-3 text-right text-lilac-300">
                                        ${Number(row.total_ventas).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        ${Number(row.ticket_promedio).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        ${Number(row.ventas_presencial).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        ${Number(row.ventas_digital).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {pct.toFixed(1)}%
                                        <div className="w-16 h-1 bg-lilac-900 rounded-full mt-1 ml-auto">
                                            <div
                                                className="h-1 bg-lilac-500 rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-lilac-500 italic">
                                    No hay ventas para este rango de fechas.
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
