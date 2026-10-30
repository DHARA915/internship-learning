-- SELECT TABLES

SELECT * FROM AUTHORS;
SELECT * FROM CATEGORIES;
SELECT * FROM CUSTOMERS;
SELECT * FROM BOOKS;
SELECT * FROM ORDERS;
SELECT * FROM ORDER_ITEMS;
SELECT * FROM BOOK_AUTHORS;

-- AUTHORS DATA
INSERT INTO AUTHORS (NAME, BIO, COUNTRY)
VALUES
    ('J.K. Rowling', 'Author of the Harry Potter series', 'United Kingdom'),
    ('George Orwell', 'Author of classic political fiction', 'United Kingdom'),
    ('R.K. Narayan', 'Indian novelist and short story writer', 'India'),
    ('Paulo Coelho', 'Author of philosophical novels', 'Brazil'),
    ('Agatha Christie', 'Author of mystery novels', 'United Kingdom');

-- CATEGORIES
INSERT INTO CATEGORIES (NAME)
VALUES
    ('Fantasy'),
    ('Fiction'),
    ('Mystery'),
    ('Self-Help');

-- CUSTOMERS DATA
INSERT INTO CUSTOMERS (NAME, EMAIL, PHONE, ADDRESS)
VALUES
    ('Dhara Patel', 'dhara@example.com', '9876543210', 'Anand, Gujarat'),
    ('Rahul Sharma', 'rahul@example.com', '9876543211', 'Ahmedabad, Gujarat'),
    ('Priya Shah', 'priya@example.com', '9876543212', 'Vadodara, Gujarat');

-- BOOKS DATA
INSERT INTO BOOKS
    (TITLE, ISBN, PRICE, STOCK_QUANTITY, AUTHOR_ID, CATEGORY_ID)
VALUES
    ('Harry Potter and the Philosopher''s Stone', '9780000000001', 499.00, 20, 1, 1),
    ('Harry Potter and the Chamber of Secrets', '9780000000002', 549.00, 15, 1, 1),
    ('1984', '9780000000003', 399.00, 25, 2, 2),
    ('Animal Farm', '9780000000004', 299.00, 30, 2, 2),
    ('Malgudi Days', '9780000000005', 350.00, 18, 3, 2),
    ('The Guide', '9780000000006', 320.00, 12, 3, 2),
    ('The Alchemist', '9780000000007', 399.00, 22, 4, 4),
    ('Murder on the Orient Express', '9780000000008', 450.00, 14, 5, 3),
    ('And Then There Were None', '9780000000009', 425.00, 16, 5, 3),
    ('Brida', '9780000000010', 375.00, 10, 4, 4);

-- ORDER DATA 
INSERT INTO ORDERS (CUSTOMER_ID, STATUS, TOTAL_AMOUNT)
VALUES
    (1, 'CONFIRMED', 1048.00),
    (2, 'SHIPPED',  848.00),
    (3, 'PENDING',  1099.00),
    (1, 'DELIVERED', 749.00),
    (2, 'CONFIRMED', 874.00);

-- ORDER ITEM DATA
INSERT INTO ORDER_ITEMS (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
VALUES
    -- Order 1
    (1, 1, 2, 499.00),
    (1, 3, 1, 399.00),

    -- Order 2
    (2, 5, 3, 350.00),
    (2, 7, 1, 399.00),

    -- Order 3
    (3, 2, 2, 549.00),
    (3, 8, 1, 450.00),
    (3, 4, 3, 299.00),

    -- Order 4
    (4, 6, 2, 320.00),
    (4, 9, 1, 425.00),

    -- Order 5
    (5, 10, 3, 375.00),
    (5, 3, 2, 399.00),
    (5, 4, 1, 299.00);

-- BOOK AUTHOR DATA
INSERT INTO BOOK_AUTHORS (BOOK_ID, AUTHOR_ID)
VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (5, 3),
    (6, 3),
    (7, 4),
    (8, 5),
    (9, 5),
    (10, 4),

    -- Example of a book with multiple authors
    (1, 2);
	
