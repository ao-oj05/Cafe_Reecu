interface InventoryRow {
    product_name: string;
    stock: number;
    risk_level: string;
    risk_percentage: number;
}

export default async function InventoryReport() {
    const res = await fetch("http://localhost:3000/api/reports/inventory", {
        cache: "no-store",
    });

    const data: InventoryRow[] = await res.json();

    return (
        <main style={{ padding: 24 }}>
            <h1>Riesgo de Inventario</h1>
            <p>Insight: productos con riesgo de desabasto.</p>

            <h3>KPI: Productos en riesgo → {data.length}</h3>

            <table border={1} cellPadding={6}>
                <thead>
                <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>% Riesgo</th>
                    <th>Nivel</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.product_name}>
                        <td>{row.product_name}</td>
                        <td>{row.stock}</td>
                        <td>{row.risk_percentage}</td>
                        <td>{row.risk_level}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
