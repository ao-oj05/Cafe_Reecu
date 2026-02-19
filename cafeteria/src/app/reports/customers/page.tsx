export default function Dashboard() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 p-10">

            {/* Contenedor */}
            <div className="max-w-5xl mx-auto">

                {/* Título */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-purple-300 drop-shadow-lg">
                        Dashboard de Reportes
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Panel principal de análisis del sistema
                    </p>
                </div>

                {/* Grid de tarjetas */}
                <div className="grid md:grid-cols-2 gap-6">

                    <a
                        href="/reports/sales"
                        className="bg-black/60 backdrop-blur-md border border-purple-700 hover:border-purple-400
                                   rounded-2xl p-6 transition duration-300 hover:scale-105
                                   hover:shadow-purple-500/30 shadow-lg group"
                    >
                        <h2 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">
                            Ventas Diarias
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Consulta el desempeño de ventas por día.
                        </p>
                    </a>

                    <a
                        href="/reports/payment-mix"
                        className="bg-black/60 backdrop-blur-md border border-purple-700 hover:border-purple-400
                                   rounded-2xl p-6 transition duration-300 hover:scale-105
                                   hover:shadow-purple-500/30 shadow-lg group"
                    >
                        <h2 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">
                            Mezcla de Pagos
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Distribución de métodos de pago utilizados.
                        </p>
                    </a>

                    <a
                        href="/reports/inventory"
                        className="bg-black/60 backdrop-blur-md border border-purple-700 hover:border-purple-400
                                   rounded-2xl p-6 transition duration-300 hover:scale-105
                                   hover:shadow-purple-500/30 shadow-lg group"
                    >
                        <h2 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">
                            Inventario en Riesgo
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Productos con bajo nivel de stock.
                        </p>
                    </a>

                    <a
                        href="/reports/customers"
                        className="bg-black/60 backdrop-blur-md border border-purple-700 hover:border-purple-400
                                   rounded-2xl p-6 transition duration-300 hover:scale-105
                                   hover:shadow-purple-500/30 shadow-lg group"
                    >
                        <h2 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">
                            Valor del Cliente
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Análisis de clientes más valiosos.
                        </p>
                    </a>

                    <a
                        href="/reports/products"
                        className="bg-black/60 backdrop-blur-md border border-purple-700 hover:border-purple-400
                                   rounded-2xl p-6 transition duration-300 hover:scale-105
                                   hover:shadow-purple-500/30 shadow-lg group md:col-span-2"
                    >
                        <h2 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">
                            Top Productos
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Productos con mejor rendimiento en ventas.
                        </p>
                    </a>

                </div>
            </div>
        </main>
    );
}
