-- =====================================================
-- db/roles.sql
-- Creación de rol app_user y permisos sobre VIEWS
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
CREATE ROLE app_user LOGIN PASSWORD 'app_pass';
END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON
    vw_sales_daily,
    vw_top_products_ranked,
    vw_inventory_risk,
    vw_customer_value,
    vw_payment_mix,
    vw_category_performance,
    vw_orders_channel_daily
    TO app_user;

REVOKE ALL ON TABLE categories  FROM app_user;
REVOKE ALL ON TABLE products    FROM app_user;
REVOKE ALL ON TABLE customers   FROM app_user;
REVOKE ALL ON TABLE orders      FROM app_user;
REVOKE ALL ON TABLE order_items FROM app_user;
REVOKE ALL ON TABLE payments    FROM app_user;