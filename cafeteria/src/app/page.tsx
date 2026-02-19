export default function Dashboard() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 p-12">

            <div className="max-w-6xl mx-auto">

                {/* TÍTULO */}
                <div className="mb-14 text-center">
                    <h1 className="text-5xl font-extrabold tracking-wide text-purple-400">
                        DASHBOARD
                    </h1>
                </div>

                {/* GRID */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* CARD */}
                    <a
                        href="/reports/sales"
                        className="bg-black border border-purple-800
                                   rounded-3xl p-8 transition-all duration-300
                                   hover:border-purple-500
                                   hover:shadow-2xl hover:shadow-purple-900/40"
                    >
                        <h2 className="text-2xl font-semibold text-purple-300 mb-3">
                            Ventas Diarias
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Consulta el rendimiento de ventas por día y analiza
                            tendencias de crecimiento.
                        </p>
                    </a>

                    <a
                        href="/reports/payment-mix"
                        className="bg-black border border-purple-800
                                   rounded-3xl p-8 transition-all duration-300
                                   hover:border-purple-500
                                   hover:shadow-2xl hover:shadow-purple-900/40"
                    >
                        <h2 className="text-2xl font-semibold text-purple-300 mb-3">
                            Mezcla de Pagos
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Visualiza la distribución de métodos de pago utilizados.
                        </p>
                    </a>

                    <a
                        href="/reports/inventory"
                        className="bg-black border border-purple-800
                                   rounded-3xl p-8 transition-all duration-300
                                   hover:border-purple-500
                                   hover:shadow-2xl hover:shadow-purple-900/40"
                    >
                        <h2 className="text-2xl font-semibold text-purple-300 mb-3">
                            Inventario en Riesgo
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Identifica productos con bajo stock o alertas activas.
                        </p>
                    </a>

                    <a
                        href="/reports/customers"
                        className="bg-black border border-purple-800
                                   rounded-3xl p-8 transition-all duration-300
                                   hover:border-purple-500
                                   hover:shadow-2xl hover:shadow-purple-900/40"
                    >
                        <h2 className="text-2xl font-semibold text-purple-300 mb-3">
                            Valor del Cliente
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Analiza clientes con mayor contribución económica.
                        </p>
                    </a>

                    <a
                        href="/reports/products"
                        className="bg-black border border-purple-800
                                   rounded-3xl p-8 md:col-span-2
                                   transition-all duration-300
                                   hover:border-purple-500
                                   hover:shadow-2xl hover:shadow-purple-900/40"
                    >
                        <h2 className="text-2xl font-semibold text-purple-300 mb-3">
                            Top Productos
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Consulta los productos con mejor rendimiento en ventas.
                        </p>
                    </a>

                </div>
            </div>
        </main>
    );
}
