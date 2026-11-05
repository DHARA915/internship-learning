-- DATA

-- USERS
INSERT INTO USERS (NAME, EMAIL, PHONE, CREATED_AT) VALUES
('Aarav Mehta', 'aarav@example.com', '9876500001', '2026-01-03 09:00:00+05:30'),
('Diya Shah', 'diya@example.com', '9876500002', '2026-01-08 09:00:00+05:30'),
('Rohan Patel', 'rohan@example.com', '9876500003', '2026-01-15 09:00:00+05:30'),
('Anaya Desai', 'anaya@example.com', '9876500004', '2026-02-02 09:00:00+05:30'),
('Vivaan Joshi', 'vivaan@example.com', '9876500005', '2026-02-12 09:00:00+05:30'),
('Isha Trivedi', 'isha@example.com', '9876500006', '2026-03-05 09:00:00+05:30'),
('Kabir Rao', 'kabir@example.com', '9876500007', '2026-03-18 09:00:00+05:30'),
('Mira Iyer', 'mira@example.com', '9876500008', '2026-04-04 09:00:00+05:30'),
('Arjun Nair', 'arjun@example.com', '9876500009', '2026-05-10 09:00:00+05:30'),
('Sara Khan', 'sara@example.com', '9876500010', '2026-06-01 09:00:00+05:30') RETURNING *;

-- PRODUCTS
INSERT INTO PRODUCTS
(NAME, SKU, CATEGORY, DESCRIPTION, PRICE, STOCK_QUANTITY, TAGS, METADATA)
VALUES
('Samsung Galaxy S24', 'ELEC-001', 'Electronics', 'Android smartphone', 64999, 35,
 ARRAY['electronics','mobile','android'],
 '{"brand":"Samsung","color":"black","warranty_years":1}'::JSONB),

('iPhone 15', 'ELEC-002', 'Electronics', 'Apple smartphone', 69999, 28,
 ARRAY['electronics','mobile','ios'],
 '{"brand":"Apple","color":"blue","warranty_years":1}'::JSONB),

('Dell Inspiron Laptop', 'ELEC-003', 'Electronics', 'Everyday laptop', 58999, 18,
 ARRAY['electronics','laptop','computers'],
 '{"brand":"Dell","ram_gb":16,"storage":"512GB SSD"}'::JSONB),

('Sony Headphones', 'ELEC-004', 'Electronics', 'Wireless headphones', 8999, 45,
 ARRAY['electronics','audio','headphones'],
 '{"brand":"Sony","wireless":true,"noise_cancellation":true}'::JSONB),

('Men Cotton T-Shirt', 'CLTH-001', 'Clothing', 'Regular fit cotton t-shirt', 799, 100,
 ARRAY['clothing','men','tshirt'],
 '{"brand":"UrbanWear","size_options":["S","M","L","XL"],"fabric":"cotton"}'::JSONB),

('Women Kurta', 'CLTH-002', 'Clothing', 'Printed cotton kurta', 1499, 70,
 ARRAY['clothing','women','ethnic'],
 '{"brand":"Aarika","fabric":"cotton","occasion":"casual"}'::JSONB),

('Running Shoes', 'CLTH-003', 'Clothing', 'Lightweight running shoes', 2999, 55,
 ARRAY['clothing','footwear','running'],
 '{"brand":"Stride","gender":"unisex","material":"mesh"}'::JSONB),

('Denim Jeans', 'CLTH-004', 'Clothing', 'Slim fit denim jeans', 2199, 60,
 ARRAY['clothing','men','denim'],
 '{"brand":"BlueFit","fabric":"denim","fit":"slim"}'::JSONB),

('Atomic Habits', 'BOOK-001', 'Books', 'Self-help book', 499, 80,
 ARRAY['books','self-help','bestseller'],
 '{"author":"James Clear","format":"paperback","language":"English"}'::JSONB),

('Clean Code', 'BOOK-002', 'Books', 'Software engineering book', 799, 50,
 ARRAY['books','programming','technology'],
 '{"author":"Robert C. Martin","format":"paperback","language":"English"}'::JSONB),

('The Alchemist', 'BOOK-003', 'Books', 'Fiction novel', 399, 90,
 ARRAY['books','fiction','bestseller'],
 '{"author":"Paulo Coelho","format":"paperback","language":"English"}'::JSONB),

('SQL Practice Guide', 'BOOK-004', 'Books', 'Database learning guide', 599, 65,
 ARRAY['books','database','education'],
 '{"author":"A. Sharma","format":"paperback","language":"English"}'::JSONB),

('Mixer Grinder', 'HOME-001', 'Home', '750W mixer grinder', 3499, 25,
 ARRAY['home','kitchen','appliance'],
 '{"brand":"Prestige","power_watts":750,"warranty_years":2}'::JSONB),

('Electric Kettle', 'HOME-002', 'Home', '1.5 litre electric kettle', 1299, 40,
 ARRAY['home','kitchen','appliance'],
 '{"brand":"Pigeon","capacity_litre":1.5,"auto_shutoff":true}'::JSONB),

('LED Desk Lamp', 'HOME-003', 'Home', 'Adjustable LED desk lamp', 999, 75,
 ARRAY['home','lighting','study'],
 '{"brand":"Wipro","power_watts":9,"dimmable":true}'::JSONB),

('Air Fryer', 'HOME-004', 'Home', '4 litre air fryer', 5999, 0,
 ARRAY['home','kitchen','appliance'],
 '{"brand":"Philips","capacity_litre":4,"warranty_years":2}'::JSONB),

('Yoga Mat', 'SPRT-001', 'Sports', 'Non-slip yoga mat', 899, 85,
 ARRAY['sports','fitness','yoga'],
 '{"brand":"FlexFit","thickness_mm":6,"material":"TPE"}'::JSONB),

('Cricket Bat', 'SPRT-002', 'Sports', 'English willow cricket bat', 4499, 20,
 ARRAY['sports','cricket','outdoor'],
 '{"brand":"SS","material":"willow","size":"SH"}'::JSONB),

('Dumbbell Set', 'SPRT-003', 'Sports', 'Adjustable dumbbell set', 3299, 30,
 ARRAY['sports','fitness','strength'],
 '{"brand":"ProGym","weight_kg":20,"adjustable":true}'::JSONB),

('Football', 'SPRT-004', 'Sports', 'Size 5 football', 1199, 50,
 ARRAY['sports','football','outdoor'],
 '{"brand":"Nivia","size":5,"material":"synthetic"}'::JSONB) RETURNING *;

-- ORDERS
INSERT INTO ORDERS (USER_ID, ORDER_DATE, ORDER_STATUS, TOTAL_AMOUNT)
VALUES
(1, '2026-01-05 10:00:00+05:30', 'DELIVERED', 0),
(2, '2026-01-12 10:00:00+05:30', 'DELIVERED', 0),
(3, '2026-01-20 10:00:00+05:30', 'SHIPPED', 0),
(1, '2026-01-26 10:00:00+05:30', 'DELIVERED', 0),
(4, '2026-01-29 10:00:00+05:30', 'CANCELLED', 0),

(2, '2026-02-03 10:00:00+05:30', 'DELIVERED', 0),
(5, '2026-02-09 10:00:00+05:30', 'DELIVERED', 0),
(3, '2026-02-14 10:00:00+05:30', 'PROCESSING', 0),
(6, '2026-02-20 10:00:00+05:30', 'DELIVERED', 0),
(1, '2026-02-25 10:00:00+05:30', 'DELIVERED', 0),

(4, '2026-03-02 10:00:00+05:30', 'DELIVERED', 0),
(7, '2026-03-08 10:00:00+05:30', 'SHIPPED', 0),
(2, '2026-03-13 10:00:00+05:30', 'DELIVERED', 0),
(5, '2026-03-19 10:00:00+05:30', 'DELIVERED', 0),
(6, '2026-03-27 10:00:00+05:30', 'CANCELLED', 0),

(8, '2026-04-03 10:00:00+05:30', 'DELIVERED', 0),
(3, '2026-04-09 10:00:00+05:30', 'DELIVERED', 0),
(7, '2026-04-15 10:00:00+05:30', 'SHIPPED', 0),
(1, '2026-04-21 10:00:00+05:30', 'DELIVERED', 0),
(9, '2026-04-28 10:00:00+05:30', 'DELIVERED', 0),

(5, '2026-05-04 10:00:00+05:30', 'DELIVERED', 0),
(8, '2026-05-10 10:00:00+05:30', 'PROCESSING', 0),
(10, '2026-05-16 10:00:00+05:30', 'DELIVERED', 0),
(4, '2026-05-22 10:00:00+05:30', 'DELIVERED', 0),
(6, '2026-05-29 10:00:00+05:30', 'CANCELLED', 0),

(9, '2026-06-02 10:00:00+05:30', 'DELIVERED', 0),
(2, '2026-06-08 10:00:00+05:30', 'DELIVERED', 0),
(7, '2026-06-14 10:00:00+05:30', 'SHIPPED', 0),
(10, '2026-06-20 10:00:00+05:30', 'DELIVERED', 0),
(3, '2026-06-27 10:00:00+05:30', 'DELIVERED', 0),

(1, '2026-07-03 10:00:00+05:30', 'DELIVERED', 0),
(5, '2026-07-09 10:00:00+05:30', 'DELIVERED', 0),
(8, '2026-07-15 10:00:00+05:30', 'PROCESSING', 0),
(9, '2026-07-22 10:00:00+05:30', 'DELIVERED', 0),
(10, '2026-07-29 10:00:00+05:30', 'DELIVERED', 0);

-- ORDER_ITEMS
INSERT INTO ORDER_ITEMS (ORDER_ID, PRODUCT_ID, QUANTITY, UNIT_PRICE)
VALUES
(1, 3, 2, 58999),
(1, 13, 3, 3499),
(2, 6, 3, 1499),
(2, 20, 1, 1199),
(3, 9, 1, 499),
(3, 7, 2, 2999),
(4, 12, 2, 599),
(4, 14, 3, 1299),
(5, 15, 3, 999),
(5, 1, 1, 64999),

(6, 18, 1, 4499),
(6, 8, 2, 2199),
(7, 1, 2, 61749.05),
(7, 15, 3, 999),
(8, 4, 3, 8999),
(8, 2, 1, 69999),
(9, 7, 1, 2999),
(9, 9, 2, 499),
(10, 10, 2, 799),
(10, 16, 3, 5999),

(11, 13, 3, 3499),
(11, 3, 1, 58999),
(12, 16, 1, 5999),
(12, 10, 2, 799),
(13, 19, 2, 3299),
(13, 17, 3, 899),
(14, 2, 3, 66499.05),
(14, 4, 1, 8999),
(15, 5, 1, 799),
(15, 11, 2, 399),

(16, 8, 2, 2199),
(16, 18, 3, 4499),
(17, 11, 3, 399),
(17, 5, 1, 799),
(18, 14, 1, 1299),
(18, 12, 2, 599),
(19, 17, 2, 899),
(19, 19, 3, 3299),
(20, 20, 3, 1199),
(20, 6, 1, 1499),

(21, 3, 1, 56049.05),
(21, 13, 2, 3499),
(22, 6, 2, 1499),
(22, 20, 3, 1199),
(23, 9, 3, 499),
(23, 7, 1, 2999),
(24, 12, 1, 599),
(24, 14, 2, 1299),
(25, 15, 2, 999),
(25, 1, 3, 64999),

(26, 18, 3, 4499),
(26, 8, 1, 2199),
(27, 1, 1, 64999),
(27, 15, 2, 999),
(28, 4, 2, 8549.05),
(28, 2, 3, 69999),
(29, 7, 3, 2999),
(29, 9, 1, 499),
(30, 10, 1, 799),
(30, 16, 2, 5999),

(31, 13, 2, 3499),
(31, 3, 3, 58999),
(32, 16, 3, 5999),
(32, 10, 1, 799),
(33, 19, 1, 3299),
(33, 17, 2, 899),
(34, 2, 2, 69999),
(34, 4, 3, 8999),
(35, 5, 3, 759.05),
(35, 11, 1, 399);

-- REVIEWS
INSERT INTO REVIEWS (USER_ID, PRODUCT_ID, RATING, COMMENT)
VALUES
(1, 1, 5, 'Excellent phone and camera.'),
(2, 2, 4, 'Good performance and battery.'),
(3, 3, 5, 'Fast laptop for daily work.'),
(4, 4, 4, 'Great sound quality.'),
(5, 5, 4, 'Comfortable cotton fabric.'),
(6, 6, 5, 'Nice design and fitting.'),
(7, 7, 4, 'Good shoes for running.'),
(8, 8, 3, 'Fit is slightly tight.'),
(9, 9, 5, 'Very useful book.'),
(10, 10, 5, 'Excellent programming reference.'),
(1, 11, 4, 'Interesting and easy to read.'),
(2, 12, 5, 'Helpful SQL examples.'),
(3, 13, 4, 'Works well in the kitchen.'),
(4, 14, 3, 'Good value for money.'),
(5, 15, 4, 'Bright and adjustable.'),
(6, 16, 5, 'Cooks food with less oil.'),
(7, 17, 4, 'Good grip and quality.'),
(8, 18, 5, 'Balanced cricket bat.'),
(9, 19, 4, 'Useful for home workouts.'),
(10, 20, 3, 'Decent football for practice.') RETURNING *;


-- UPDATE TOTAL_AMOUNT

UPDATE ORDERS O SET TOTAL_AMOUNT = (SELECT COALESCE(SUM(OI.LINE_TOTAL),0)
FROM ORDER_ITEMS OI
WHERE OI.ORDER_ID = O.ID
);

-- ADDING REFRENCING PRODUCT_ID
UPDATE PRODUCTS
SET RELATED_PRODUCT_ID = CASE ID

    WHEN 1 THEN 2
    WHEN 2 THEN 3
    WHEN 3 THEN 4

    WHEN 5 THEN 6
    WHEN 6 THEN 7
    WHEN 7 THEN 8

    WHEN 9 THEN 10
    WHEN 10 THEN 11
    WHEN 11 THEN 12

    WHEN 13 THEN 14
    WHEN 14 THEN 15
    WHEN 15 THEN 16

    WHEN 17 THEN 18
    WHEN 18 THEN 19
    WHEN 19 THEN 20

    ELSE NULL
END;

-- ADD PREFERENCE COLUMN DATA IN USERS TABLE

UPDATE USERS
SET PREFERENCES =
    CASE
        WHEN ID % 3 = 0 THEN
            '{"newsletter": true, "theme": "dark", "notifications": true}'::JSONB

        WHEN ID % 3 = 1 THEN
            '{"newsletter": false, "theme": "light", "notifications": true}'::JSONB

        ELSE
            '{"newsletter": true, "theme": "light", "notifications": false}'::JSONB
    END;
