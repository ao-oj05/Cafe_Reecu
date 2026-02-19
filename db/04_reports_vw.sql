-- ¿Qué devuelve? Resumen diario de ventas.
-- Grain: 1 fila por día.
-- Métricas: total_ventas (SUM), tickets (COUNT), ticket_promedio (AVG calculado),
--           ingreso_canal_presencial vs digital (CASE).
CREATE OR REPLACE VIEW vw_sales_daily AS
SELECT
DATE(o.created_at) AS sale_date,
COUNT(DISTINCT o.id)AS tickets,
SUM(oi.qty * oi.unit_price) AS total_ventas,
ROUND(
SUM(oi.qty * oi.unit_price)::NUMERIC
/ NULLIF(COUNT(DISTINCT o.id), 0), 2
) AS ticket_promedio,
SUM(
CASE WHEN o.channel = 'presencial' THEN oi.qty * oi.unit_price ELSE 0 END
) AS ventas_presencial,
SUM(
CASE WHEN o.channel != 'presencial' THEN oi.qty * oi.unit_price ELSE 0 END
) AS ventas_digital,
ROUND(
SUM(CASE WHEN o.channel != 'presencial' THEN oi.qty * oi.unit_price ELSE 0 END)::NUMERIC
/ NULLIF(SUM(oi.qty * oi.unit_price), 0) * 100, 2
) AS pct_ventas_digital
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)
HAVING SUM(oi.qty * oi.unit_price) > 0;

-- VIEW 2: vw_top_products_ranked
-- ¿Qué devuelve? Ranking de productos por revenue y por unidades vendidas.
-- Grain: 1 fila por producto activo.
-- Métricas: total_revenue (SUM), total_unidades (SUM), rank por revenue y por unidades.

CREATE OR REPLACE VIEW vw_top_products_ranked AS
WITH product_sales AS (
SELECT
p.id AS product_id,
p.name AS nombre_producto,
c.name AS categoria,
p.price AS precio_unitario,
SUM(oi.qty) AS total_unidades,
SUM(oi.qty * oi.unit_price) AS total_revenue
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o  ON o.id = oi.order_id AND o.status = 'completed'
WHERE p.active = true
GROUP BY p.id, p.name, c.name, p.price
HAVING SUM(oi.qty * oi.unit_price) > 0
)
SELECT
    product_id,
    nombre_producto,
    categoria,
    precio_unitario,
    total_unidades,
    total_revenue,
    ROUND(total_revenue::NUMERIC / NULLIF(total_unidades, 0), 2) AS precio_promedio_venta,
    RANK() OVER (ORDER BY total_revenue   DESC)                  AS rank_revenue,
    RANK() OVER (ORDER BY total_unidades  DESC)                  AS rank_unidades
FROM product_sales;


-- VIEW 3: vw_inventory_risk
-- ¿Qué devuelve? Productos y categorías con bajo stock, semáforo de riesgo.
-- Grain: 1 fila por producto activo.
-- Métricas: stock actual, promedio de stock por categoría (AVG con Window),
--           porcentaje vs promedio categoría, nivel_riesgo (CASE).


CREATE OR REPLACE VIEW vw_inventory_risk AS
SELECT
p.id AS product_id,
p.name AS nombre_producto,
c.id   AS category_id,
c.name AS categoria,
p.stock AS stock_actual,
ROUND(AVG(p.stock) OVER (PARTITION BY c.id), 2) AS stock_promedio_categoria,
ROUND(
p.stock::NUMERIC
/ NULLIF(AVG(p.stock) OVER (PARTITION BY c.id), 0) * 100, 2
) AS pct_vs_promedio_cat,
COUNT(p.id) OVER (PARTITION BY c.id) AS productos_en_categoria,
COALESCE(p.stock, 0) AS stock_seguro,
CASE
WHEN p.stock = 0 THEN 'SIN STOCK'
WHEN p.stock <= 5 THEN 'CRÍTICO'
WHEN p.stock <= 20 THEN 'BAJO'
WHEN p.stock <= 50 THEN 'MODERADO'
ELSE 'NORMAL'
END AS nivel_riesgo
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = true;



-- VIEW 4: vw_customer_value
-- ¿Qué devuelve? Valor histórico de cada cliente.
-- Grain: 1 fila por cliente con al menos 1 orden completada.
-- Métricas: total_gastado (SUM), num_ordenes (COUNT), gasto_promedio (AVG),
--           primera y última compra (MIN/MAX), segmento (CASE).\

CREATE OR REPLACE VIEW vw_customer_value AS
SELECT
cu.id AS customer_id,
cu.name AS nombre_cliente,
cu.email AS email,
COUNT(DISTINCT o.id) AS num_ordenes,
SUM(oi.qty * oi.unit_price) AS total_gastado,
ROUND(
SUM(oi.qty * oi.unit_price)::NUMERIC
/ NULLIF(COUNT(DISTINCT o.id), 0), 2
) AS gasto_promedio_orden,
MIN(o.created_at) AS primera_compra,
MAX(o.created_at) AS ultima_compra,
CASE
WHEN SUM(oi.qty * oi.unit_price) >= 500  THEN 'VIP'
WHEN SUM(oi.qty * oi.unit_price) >= 200  THEN 'FRECUENTE'
WHEN SUM(oi.qty * oi.unit_price) >= 50   THEN 'REGULAR'
ELSE  'NUEVO'
END AS segmento_cliente
FROM customers cu
JOIN orders o ON o.customer_id = cu.id AND o.status = 'completed'
JOIN order_items oi ON oi.order_id = o.id
GROUP BY cu.id, cu.name, cu.email
HAVING COUNT(DISTINCT o.id) >= 1;

-- VIEW 5: vw_payment_mix
-- ¿Qué devuelve? Distribución de métodos de pago.
-- Grain: 1 fila por método de pago.
-- Métricas: total recaudado (SUM), número de transacciones (COUNT),
--           porcentaje del total (campo calculado), ticket promedio (AVG calculado).


CREATE OR REPLACE VIEW vw_payment_mix AS
WITH totales AS (
SELECT SUM(paid_amount) AS gran_total
FROM payments
)
SELECT
p.method AS metodo_pago,
COUNT(p.id) AS num_transacciones,
SUM(p.paid_amount) AS total_recaudado,
ROUND(
SUM(p.paid_amount)::NUMERIC
/ NULLIF(t.gran_total, 0) * 100, 2
) AS pct_del_total,
ROUND(AVG(p.paid_amount)::NUMERIC, 2) AS ticket_promedio_pago,
MIN(p.paid_amount) AS pago_minimo,
MAX(p.paid_amount) AS pago_maximo
FROM payments p
CROSS JOIN totales t
GROUP BY p.method, t.gran_total
HAVING SUM(p.paid_amount) > 0;


