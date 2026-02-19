interface PaymentRow {
    payment_method: string;
    total_transactions: number;
    total_amount: number;
    percentage: number;
}

export default async function PaymentMixReport() {
    const res = await fetch("http://localhost:3000/api/reports/payment-mix", {
        cache: "no-store",
    });

    const data: PaymentRow[] = await res.json();

    return (
        <main style={{ padding: 24 }}>
            <h1>Mezcla de Métodos de Pago</h1>
            <p>Insight: distribución de métodos de pago.</p>

            <h3>KPI: Método principal → {data[0]?.payment_method}</h3>

            <table border={1} cellPadding={6}>
                <thead>
                <tr>
                    <th>Método</th>
                    <th>Transacciones</th>
                    <th>Total</th>
                    <th>%</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.payment_method}>
                        <td>{row.payment_method}</td>
                        <td>{row.total_transactions}</td>
                        <td>{row.total_amount}</td>
                        <td>{row.percentage}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
