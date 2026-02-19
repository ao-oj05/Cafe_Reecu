import { headers } from "next/headers";

type PaymentRow = {
    metodo_pago: string;
    num_transacciones: number;
    total_recaudado: string;
    pct_del_total: string;
    ticket_promedio_pago: string;
    pago_minimo: string;
    pago_maximo: string;
};

async function getPaymentMix(): Promise<PaymentRow[]> {
    const headersList = await headers();
    const host = headersList.get("host");
    const res = await fetch(`http://${host}/api/reports/payment-mix`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener mix de pagos");
    return res.json();
}

export default async function PaymentMixReport() {
    const data = await getPaymentMix();
    const topMetodo = data[0];

    const totalGeneral = data.reduce(
        (sum, r) => sum + Number(r.total_recaudado),
        0
    );

    const totalTx = data.reduce(
        (sum, r) => sum + Number(r.num_transacciones),
        0
    );

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* HEADER */}
                <div className="border-b border-purple-900 pb-6">
                    <p className="text-xs uppercase tracking-widest text-purple-400 mb-2">
                        Reportes · Analítica
                    </p>
                    <h1 className="text-3xl font-bold text-purple-300">
                        Mix de Pagos
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Distribución y participación de métodos de pago
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Método Principal
                        </p>
                        <p className="text-xl font-semibold capitalize text-purple-300">
                            {topMetodo?.metodo_pago ?? "-"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            {topMetodo
                                ? `${Number(topMetodo.pct_del_total).toFixed(1)}% del total`
                                : ""}
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Total Recaudado
                        </p>
                        <p className="text-xl font-semibold text-purple-300">
                            ${totalGeneral.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-purple-900 rounded-xl p-6">
                        <p className="text-xs uppercase tracking-wider text-purple-400 mb-2">
                            Total Transacciones
                        </p>
                        <p className="text-xl font-semibold text-purple-300">
                            {totalTx}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            {data.length} métodos activos
                        </p>
                    </div>
                </div>

                {/* CARDS POR MÉTODO */}
                <div className="grid md:grid-cols-2 gap-6">
                    {data.map((row) => {
                        const pct = Number(row.pct_del_total);

                        return (
                            <div
                                key={row.metodo_pago}
                                className="bg-zinc-900 border border-purple-900 rounded-xl p-6 space-y-3"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="capitalize font-medium text-purple-300">
                                        {row.metodo_pago}
                                    </span>
                                    <span className="text-sm text-purple-400">
                                        {pct.toFixed(1)}%
                                    </span>
                                </div>

                                <p className="text-lg font-semibold">
                                    ${Number(row.total_recaudado).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </p>

                                <p className="text-sm text-gray-400">
                                    {row.num_transacciones} transacciones · Ticket prom. $
                                    {Number(row.ticket_promedio_pago).toFixed(2)}
                                </p>

                                {/* Barra */}
                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Min ${Number(row.pago_minimo).toFixed(2)}</span>
                                    <span>Max ${Number(row.pago_maximo).toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* TABLA */}
                <div className="bg-zinc-900 border border-purple-900 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-purple-950 text-purple-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-3 text-left">Método</th>
                            <th className="p-3 text-right">Transacciones</th>
                            <th className="p-3 text-right">Total</th>
                            <th className="p-3 text-right">% Total</th>
                            <th className="p-3 text-right">Ticket</th>
                            <th className="p-3 text-right">Min</th>
                            <th className="p-3 text-right">Max</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.metodo_pago}
                                className="border-t border-zinc-800 hover:bg-zinc-800/60 transition"
                            >
                                <td className="p-3 capitalize text-purple-300">
                                    {row.metodo_pago}
                                </td>
                                <td className="p-3 text-right">
                                    {row.num_transacciones}
                                </td>
                                <td className="p-3 text-right text-purple-400 font-medium">
                                    ${Number(row.total_recaudado).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right">
                                    {Number(row.pct_del_total).toFixed(1)}%
                                </td>
                                <td className="p-3 text-right">
                                    ${Number(row.ticket_promedio_pago).toFixed(2)}
                                </td>
                                <td className="p-3 text-right">
                                    ${Number(row.pago_minimo).toFixed(2)}
                                </td>
                                <td className="p-3 text-right">
                                    ${Number(row.pago_maximo).toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-500">
                                    No hay datos de pagos.
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
