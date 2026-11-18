-- Backend node task 5

SELECT * FROM USERS;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT to_regclass('public.users');

SELECT * FROM categories;
SELECT * FROM products;

SELECT
    conname,
    contype
FROM pg_constraint
WHERE conrelid = 'products'::regclass;

-- INSERTING CATEGORY
INSERT INTO categories (name, description)
VALUES ('Electronics', 'Electronic products')
RETURNING *;

-- INSERTING PRODUCTS
INSERT INTO products
(name, description, price, stock, category_id)
VALUES
('Laptop', 'Dell laptop', 55000, 10, 1)
RETURNING *;

-- INVALID CATEGORY ID
INSERT INTO products
(name, price, stock, category_id)
VALUES
('Mobile', 25000, 5, 999);

-- CHECK CONSTRAINT
INSERT INTO products
(name, price, stock, category_id)
VALUES
('Invalid Product', -100, 5, 1);

-- CHECK MIGRATION HISTORY
SELECT * FROM pgmigrations


INSERT INTO users (name, email, password_hash, role)
VALUES ('Dhara', 'dhara@example.com', 'test_hash', 'user')
RETURNING *;

UPDATE users
SET name = 'Dhara Patel',
    updated_at = NOW()
WHERE id = 1
RETURNING *;


INSERT INTO users (name, email, password_hash, role)
VALUES
    ('Rahul Sharma', 'rahul@gmail.com', 'dummy_hash_002', 'user'),
    ('Priya Shah', 'priya@gmail.com', 'dummy_hash_003', 'user'),
    ('Amit Patel', 'amit@gmail.com', 'dummy_hash_004', 'manager'),
    ('Neha Desai', 'neha@gmail.com', 'dummy_hash_005', 'admin');

-- CREATING ACCOUNT TABLE

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_holder VARCHAR(100) NOT NULL,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

INSERT INTO accounts (account_holder, balance)
VALUES
    ('Dhara Patel', 10000),
    ('Rahul Sharma', 5000),
    ('Priya Shah', 8000);

SELECT * FROM ACCOUNTS ORDER BY ID;

-- CHECK ADDED VERSION FILE 
SELECT id, name, price, version
FROM products
LIMIT 10;



SELECT id, name, price, stock, category_id, version
FROM products
LIMIT 5;

-- ADDING USERS ASSOCIATED WITH PRODUCT RANDOMLY

UPDATE products
SET created_by = (
    SELECT id
    FROM users
    ORDER BY RANDOM()
    LIMIT 1
)
WHERE created_by IS NULL;

SELECT * FROM PRODUCTS;
