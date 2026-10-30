-- SELECT QUERIES
SELECT * FROM AUTHORS;
SELECT * FROM CATEGORIES;
SELECT * FROM CUSTOMERS;
SELECT * FROM BOOKS;
SELECT * FROM ORDERS;
SELECT * FROM ORDER_ITEMS;
SELECT * FROM BOOK_AUTHORS;

-- verifying all indexes avaliable in books table;
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'books';

-- CREATE UNIQUE INDEX  (FOR ISBN IN TABLE THERE IS UNIQUE CONSTRAINT SO BY DEFAULT IT IS INDEXED NO NEED TO AGAIN INDEX IT.)
CREATE UNIQUE INDEX idx_books_isbn ON BOOKS(ISBN);

-- manually set seq_scan off for testing indexing.
SET enable_seqscan = OFF;

EXPLAIN ANALYZE SELECT * FROM BOOKS; -- SEQUENTIAL
EXPLAIN ANALYZE SELECT isbn FROM BOOKS; --INDEX 

-- DROP INDEX

DROP INDEX idx_books_isbn;

-- manually on seq_scan.
SET enable_seqscan = ON;

-- MATERIALIZE QUERY
-- Remember: A materialized view stores the calculated results.
-- After creating it, changes to the ORDERS table are not automatically reflected.
-- It continues showing the previously stored results until you run
-- REFRESH MATERIALIZED VIEW monthly_sales;

-- Create a MATERIALIZED VIEW 'monthly_sales' with: month, total orders, total revenue from orders table, then REFRESH it

CREATE MATERIALIZED VIEW  monthly_sales AS
SELECT DATE_TRUNC('month', ORDER_DATE):: DATE as month,
       COUNT(*) AS total_order,
	   SUM(total_amount) AS total_revenue
FROM ORDERS
GROUP BY DATE_TRUNC('month', ORDER_DATE)::DATE;

SELECT * FROM monthly_sales; -- show 3 orders

-- INSERT ONE ORDER INTO ORDERS TABLE TO CHEAK BEFORE REFRESHING MATERIALIZE VIEW.
INSERT INTO ORDERS (CUSTOMER_ID, TOTAL_AMOUNT)
VALUES (2, 2500) RETURNING *;

REFRESH MATERIALIZED VIEW monthly_sales;
SELECT * FROM monthly_sales; -- show all 4 orders

-- TRANSACTION...........................................................................................................................

-- BEGIN a transaction: insert an order, insert 2 order_items, COMMIT
BEGIN;

INSERT INTO ORDERS (CUSTOMER_ID, TOTAL_AMOUNT) VALUES (2,3200) RETURNING ID;

-- Insert the first item
INSERT INTO ORDER_ITEMS
    (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
VALUES
    (18, 2, 2, 500);

-- Insert the second item
INSERT INTO ORDER_ITEMS
    (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
VALUES
    (18, 3, 1, 500);

COMMIT;

ROLLBACK;

-- Use SAVEPOINT: Begin transaction, insert order, SAVEPOINT s1, insert item, error, ROLLBACK TO s1, insert correct item, COMMIT

BEGIN;

INSERT INTO ORDERS (CUSTOMER_ID, TOTAL_AMOUNT)
VALUES (2, 1000)
RETURNING ID;

SAVEPOINT s1;

INSERT INTO ORDER_ITEMS
    (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
VALUES
    (32, 999999, 1, 500);

ROLLBACK TO SAVEPOINT s1;

INSERT INTO ORDER_ITEMS
    (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
VALUES
    (32, 2, 2, 500);
COMMIT;

