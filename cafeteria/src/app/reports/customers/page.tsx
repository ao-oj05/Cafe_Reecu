interface CustomerRow {
    customer_name: string;
    total_orders: number;
    total_spent: number;
    customer_type: string;
}

export default async function CustomersReport() {
    const res = await fetch("http://localhost:3000/api/reports/customers", {
        cache: "no-store",
    });

    const data = await res.json();

    // 🔥 Validación importante
    const customers: CustomerRow[] = Array.isArray(data) ? data : [];

    return (
        <main style={{ padding: 24 }}>
            <h1>Valor de Clientes</h1>
            <p>Insight: segmentación y valor de vida del cliente.</p>

            <h3>KPI: Cliente Top → {customers[0]?.customer_name ?? "N/A"}</h3>

            <table border={1} cellPadding={6}>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Órdenes</th>
                    <th>Total Gastado</th>
                    <th>Tipo</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((row) => (
                    <tr key={row.customer_name}>
                        <td>{row.customer_name}</td>
                        <td>{row.total_orders}</td>
                        <td>{row.total_spent}</td>
                        <td>{row.customer_type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
