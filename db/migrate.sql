-- =========================================================================================
-- migrate.sql
-- Migraciones incrementales posteriores al schema inicial
-- =========================================================================================

-- 1. Índice para mejorar consultas de reportes por fecha
CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON orders(created_at);

-- 2. Índice para acelerar joins entre payments y orders
CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON payments(order_id);

-- 3. Índice para acelerar joins entre order_items y orders
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items(order_id);

-- 4. Índice para acelerar filtros por status en orders
CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders(status);