# ExamenPracticoWebU1
## Proyecto de Reportes – Arquitectura Web Orientada a Servicios

Este proyecto consiste en una aplicación de reportes desarrollada con PostgreSQL y Next.js, donde la información es consultada exclusivamente a través de VIEWS, cumpliendo con buenas prácticas de seguridad y arquitectura.

## Tecnologías utilizadas
PostgreSQL
Next.js
Node.js
Docker y Docker Compose
pgAdmin

## Ejecución del proyecto con Docker
Requisitos
- Tener Docker y Docker Compose instalados
  Comando de ejecución
  Desde la raíz del proyecto ejecutar:
  docker compose up --build

Esto levantará:
Un contenedor con PostgreSQL
Un contenedor con la aplicación Next.js
http://localhost:3000

## Ejecución del frontend sin Docker (opcional)

Si se desea ejecutar solo el frontend:
cd frontend
npm install
npm run dev

## Reportes disponibles
Ventas diarias
Productos más vendidos
Riesgo de inventario
Distribución de métodos de pago
Valor del cliente