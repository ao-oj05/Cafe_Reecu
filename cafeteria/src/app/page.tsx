export default function Dashboard() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Dashboard de Reportes</h1>

            <ul>
                <li><a href="/reports/sales">Ventas diarias</a></li>
                <li><a href="/reports/payment-mix">Mezcla de pagos</a></li>
                <li><a href="/reports/inventory">Inventario en riesgo</a></li>
                <li><a href="/reports/customers">Valor del cliente</a></li>
                <li><a href="/reports/products">Top productos</a></li>
            </ul>
        </main>
    );
}
