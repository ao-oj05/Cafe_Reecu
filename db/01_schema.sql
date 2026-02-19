
CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
category_id INT NOT NULL,
price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
stock INT NOT NULL CHECK (stock >= 0),
active BOOLEAN NOT NULL DEFAULT true,
CONSTRAINT fk_products_category
FOREIGN KEY (category_id)
REFERENCES categories(id)
);

CREATE TABLE customers (
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
customer_id INT NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(50) NOT NULL,
channel VARCHAR(50) NOT NULL,
CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id)
);


CREATE TABLE order_items (
id SERIAL PRIMARY KEY,
order_id INT NOT NULL,
product_id INT NOT NULL,
qty INT NOT NULL CHECK (qty > 0),
unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
CONSTRAINT fk_items_order
FOREIGN KEY (order_id)
REFERENCES orders(id),
CONSTRAINT fk_items_product
FOREIGN KEY (product_id)
REFERENCES products(id)
);

CREATE TABLE payments (
id SERIAL PRIMARY KEY,
order_id INT NOT NULL,
method VARCHAR(50) NOT NULL,
paid_amount NUMERIC(10,2) NOT NULL CHECK (paid_amount >= 0),
CONSTRAINT fk_payments_order
FOREIGN KEY (order_id)
REFERENCES orders(id)
);

