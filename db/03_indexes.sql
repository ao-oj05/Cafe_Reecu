CREATE INDEX idx_customers_email
    ON customers(email);

CREATE INDEX idx_orders_created_status
    ON orders(created_at, status);

CREATE INDEX idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX idx_order_items_product_id
    ON order_items(product_id);

CREATE INDEX idx_payments_method
    ON payments(method);
