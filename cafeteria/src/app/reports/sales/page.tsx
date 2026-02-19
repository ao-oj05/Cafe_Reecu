interface SalesRow {
    sale_date: string;
    total_orders: number;
    total_sales: number;
    avg_ticket: number;
}

export default async function SalesReport() {
    const res = await fetch("http://localhost:3000/api/reports/sales", {
        cache: "no-store",
    });

    const data: SalesRow[] = await res.json();

    return (
        <main style={{ padding: 24 }}>
            <h1>Reporte de Ventas Diarias</h1>
            <p>Insight: análisis del desempeño diario del negocio.</p>

            <h3>KPI: Días con ventas → {data.length}</h3>

            <table border={1} cellPadding={6}>
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Órdenes</th>
                    <th>Total Ventas</th>
                    <th>Ticket Promedio</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.sale_date}>
                        <td>{row.sale_date}</td>
                        <td>{row.total_orders}</td>
                        <td>{row.total_sales}</td>
                        <td>{row.avg_ticket}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
