import { ReactNode } from "react";

export const metadata = {
    title: "Examen Dashboard",
    description: "Dashboard de reportes con Next.js + PostgreSQL",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="es">
        <body>
        {children}
        </body>
        </html>
    );
}
