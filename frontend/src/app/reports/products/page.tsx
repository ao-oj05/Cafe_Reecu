import Link from "next/link";

interface Product {
    product_name: string;
    total_vendido: number;
    revenue: number;
    ranking: number;
}

interface Props {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function ProductsReport({ searchParams }: Props) {
    const params = await searchParams;

    const search = params?.search ?? "";
    const page = Number(params?.page ?? 1);
    const limit = 5;

    const res = await fetch(
        `http://localhost:3000/api/reports/products?search=${search}&page=${page}&limit=${limit}`,
        { cache: "no-store" }
    );

    const data = await res.json();

    return (
        <main style={{ padding: 20 }}>
            <h1>Top Productos</h1>

            <form method="GET">
                <input
                    type="text"
                    name="search"
                    placeholder="Buscar producto..."
                    defaultValue={search}
                />
                <button type="submit">Buscar</button>
            </form>

            {data.data.length === 0 ? (
                <p>No hay resultados</p>
            ) : (
                <table border={1} cellPadding={5}>
                    <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Producto</th>
                        <th>Total Vendido</th>
                        <th>Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.data.map((item: Product, index: number) => (
                        <tr key={index}>
                            <td>{item.ranking}</td>
                            <td>{item.product_name}</td>
                            <td>{item.total_vendido}</td>
                            <td>${item.revenue}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: 10 }}>
                {page > 1 && (
                    <Link href={`?search=${search}&page=${page - 1}`}>
                        Anterior
                    </Link>
                )}

                {"  "}

                {page < data.totalPages && (
                    <Link href={`?search=${search}&page=${page + 1}`}>
                        Siguiente
                    </Link>
                )}
            </div>
        </main>
    );
}
