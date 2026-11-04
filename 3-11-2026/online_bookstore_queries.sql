-- Using the bookstore schema designed (books, authors, categories, customers,
-- orders, order_items), write queries for a real bookstore application. All queries in a single .sql file.

-- Q:2 Show all books with author name, category name, price, stock - sorted by category then price

SELECT * FROM BOOKS ORDER BY ID;
SELECT * FROM AUTHORS ORDER BY ID;
SELECT * FROM CATEGORIES ORDER BY ID;
SELECT * FROM CUSTOMERS ORDER BY ID;
SELECT * FROM ORDERS ORDER BY ID;
SELECT * FROM ORDER_ITEMS ORDER BY ID;
SELECT * FROM BOOK_AUTHORS;

SELECT B.ID AS BOOK_ID , B.TITLE , A.NAME AS AUTHOR_NAME, C.NAME AS CATEGORY_NAME,B.PRICE,B.STOCK_QUANTITY
FROM BOOKS B
LEFT JOIN AUTHORS A
     ON B.AUTHOR_ID = A.ID
INNER JOIN CATEGORIES C
     ON B.CATEGORY_ID = C.ID
ORDER BY BOOK_ID;

-- Q:3 Find the top 5 best-selling books (by total quantity sold across all orders)

SELECT B.ID, B.TITLE , SUM(OI.QUANTITY) AS TOTAL_QUANTITY_SOLD FROM BOOKS B 
INNER JOIN ORDER_ITEMS OI
ON B.ID = OI.BOOK_ID 
GROUP BY B.ID,B.TITLE ORDER BY TOTAL_QUANTITY_SOLD DESC LIMIT 5;

-- Q:4 For each customer, show: total orders, total spent, average order value, last order date

SELECT C.ID, C.NAME, C.EMAIL, C.PHONE , C.ADDRESS, COALESCE(SUM(OI.QUANTITY),0) AS TOTAL_QUANTITY, 
COALESCE(SUM(OI.LINE_TOTAL),0) AS TOTAL_SPENT , AVG(OI.LINE_TOTAL) AS AVG_ORDER_VALUE,
MAX(ORDER_DATE) AS LAST_ORDER_DATE 
FROM CUSTOMERS C  LEFT JOIN
ORDERS O  
   ON C.ID = O.CUSTOMER_ID
LEFT JOIN ORDER_ITEMS OI
   ON O.ID = OI.ORDER_ID
GROUP BY C.ID ;

-- Q:5 Find customers who have never placed an order (LEFT JOIN approach)
SELECT
    C.ID,
    C.NAME,
    C.EMAIL,
    C.PHONE
FROM CUSTOMERS C
LEFT JOIN ORDERS O
    ON C.ID = O.CUSTOMER_ID
WHERE O.ID IS NULL;

-- Q:6 Show monthly revenue (DATE_TRUNC) for the last 6 months, include months with zero revenue

WITH MONTHS AS (
    SELECT GENERATE_SERIES(
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
        DATE_TRUNC('month', CURRENT_DATE),
        INTERVAL '1 month'
    ) AS MONTH
),

MONTHLY_REVENUE AS (
    SELECT
        DATE_TRUNC('month', ORDER_DATE) AS MONTH,
        SUM(TOTAL_AMOUNT) AS REVENUE
    FROM ORDERS
    WHERE ORDER_DATE >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
      AND ORDER_DATE < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY DATE_TRUNC('month', ORDER_DATE)
)

SELECT
    TO_CHAR(M.MONTH, 'YYYY-MM') AS MONTH,
    COALESCE(MR.REVENUE, 0) AS MONTHLY_REVENUE
FROM MONTHS M
LEFT JOIN MONTHLY_REVENUE MR
    ON M.MONTH = MR.MONTH
ORDER BY M.MONTH;

-- Q:7 Find books that are low stock (< 5) and have been ordered in the last 30 days

SELECT B.TITLE , B.STOCK_QUANTITY , O.ORDER_DATE
FROM ORDERS O
INNER JOIN ORDER_ITEMS OI
      ON O.ID = OI.ORDER_ID
INNER JOIN BOOKS B
      ON B.ID = OI.BOOK_ID
	     WHERE STOCK_QUANTITY < 5 AND 
         ORDER_DATE >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY B.STOCK_QUANTITY ASC;

-- Q:8 List all orders with their items, show: order id, customer name,
-- book title, quantity, line total, order total

SELECT OI.ORDER_ID , C.NAME AS CUSTOMER_NAME , B.TITLE AS BOOK_TITLE, 
OI.QUANTITY, OI.LINE_TOTAL, O.TOTAL_AMOUNT AS ORDER_TOTAL 
FROM ORDERS O 
INNER JOIN CUSTOMERS C 
      ON O.CUSTOMER_ID = C.ID
INNER JOIN ORDER_ITEMS OI
      ON O.ID = OI.ORDER_ID
INNER JOIN BOOKS B 
      ON OI.BOOK_ID = B.ID
ORDER BY O.ID;

-- Q:9 Find the most popular category (by number of books sold)
SELECT
    C.ID AS CATEGORY_ID,
    C.NAME AS CATEGORY_NAME,
    SUM(OI.QUANTITY) AS TOTAL_BOOKS_SOLD

FROM BOOKS B
INNER JOIN CATEGORIES C
    ON C.ID = B.CATEGORY_ID
INNER JOIN ORDER_ITEMS OI
    ON B.ID = OI.BOOK_ID
GROUP BY
    C.ID,
    C.NAME
ORDER BY
    TOTAL_BOOKS_SOLD DESC
LIMIT 1;

-- Q:10 For each author, show their books count, total revenue generated, and average book price

SELECT A.ID AS AUTHOR_ID , A.NAME AS AUTHOR_NAME ,
COUNT(B.AUTHOR_ID) AS TOTAL_BOOKS , COALESCE(AVG(B.PRICE),0) AS AVG_PRICE,
COALESCE(SUM(OI.LINE_TOTAL),0) AS TOTAL_REVENUE
FROM AUTHORS A
INNER JOIN BOOKS B
      ON A.ID = B.AUTHOR_ID
INNER JOIN ORDER_ITEMS OI
      ON B.ID = OI.BOOK_ID
GROUP BY A.ID,A.NAME ORDER BY A.ID;

-- Q:11 Write a query to apply a 10% discount on all books in 'Fiction' category - UPDATE with JOIN

SELECT B.ID, B.TITLE, B.PRICE, C.NAME
FROM BOOKS B
INNER JOIN CATEGORIES C
    ON B.CATEGORY_ID = C.ID
WHERE C.NAME = 'Fiction';

UPDATE BOOKS B 
SET PRICE = PRICE * 0.90
FROM CATEGORIES C
WHERE B.CATEGORY_ID = C.ID
  AND C.NAME = 'Fiction';

-- Q:12 Test CASCADE delete: delete an order and verify items are removed. Test RESTRICT: try deleting a book that has order_items
SELECT * FROM ORDERS ORDER BY ID;
SELECT * FROM ORDER_ITEMS ORDER BY ORDER_ID;

-- CASCADE DELETE 
DELETE FROM ORDERS WHERE ID = 2;

-- RESTRICT DELETE
DELETE FROM BOOKS WHERE ID = 2;
-- ERROR:  update or delete on table "books" violates RESTRICT setting of foreign key constraint "order_items_book_id_fkey" on table "order_items"
-- Key (id)=(2) is referenced from table "order_items". 

-- Q:13 Create a VIEW 'book_catalog' showing: title, author, category, price, stock status ('In Stock'/'Low Stock'/'Out of Stock').

CREATE VIEW book_catalog AS

SELECT
    B.TITLE AS BOOK_TITLE,
    COALESCE(A.NAME, 'Unknown Author') AS AUTHOR_NAME,
    C.NAME AS CATEGORY_NAME,
    B.PRICE,
    B.STOCK_QUANTITY,

    CASE
        WHEN B.STOCK_QUANTITY = 0 THEN 'Out of Stock'
        WHEN B.STOCK_QUANTITY < 5 THEN 'Low Stock'
        ELSE 'In Stock'
    END AS STOCK_STATUS

FROM BOOKS B

LEFT JOIN AUTHORS A
    ON B.AUTHOR_ID = A.ID

INNER JOIN CATEGORIES C
    ON B.CATEGORY_ID = C.ID;

-- VIEW CATALOG
SELECT * FROM book_catalog;

-- Q:14 Write a transaction: create an order (insert order + 3 order_items + update book stock for each item), COMMIT only if all succeed

BEGIN;

DO $$
DECLARE
    v_order_id INTEGER;
    v_updated_count INTEGER;
BEGIN

    -- 1. Create the order
    INSERT INTO ORDERS (CUSTOMER_ID)
    VALUES (4)
    RETURNING ID INTO v_order_id;


    -- 2. Update stock for all three books
    UPDATE BOOKS B
    SET STOCK_QUANTITY = B.STOCK_QUANTITY - V.QUANTITY
    FROM (
        VALUES
            (2, 2),
            (3, 1),
            (4, 3)
    ) AS V(BOOK_ID, QUANTITY)
    WHERE B.ID = V.BOOK_ID
      AND B.STOCK_QUANTITY >= V.QUANTITY;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    -- Validate that all three books were updated
    IF v_updated_count <> 3 THEN
        RAISE EXCEPTION
            'One or more books do not exist or have insufficient stock';
    END IF;


    -- 3. Insert all three order items
    INSERT INTO ORDER_ITEMS
        (ORDER_ID, BOOK_ID, QUANTITY, UNITPRICE)
    SELECT
        v_order_id,
        B.ID,
        V.QUANTITY,
        B.PRICE
    FROM (
        VALUES
            (2, 2),
            (3, 1),
            (4, 3)
    ) AS V(BOOK_ID, QUANTITY)
    INNER JOIN BOOKS B ON B.ID = V.BOOK_ID;


    -- 4. Calculate and update order total
    UPDATE ORDERS
    SET TOTAL_AMOUNT = (
        SELECT SUM(LINE_TOTAL)
        FROM ORDER_ITEMS
        WHERE ORDER_ID = v_order_id
    )
    WHERE ID = v_order_id;

    RAISE NOTICE 'Order % created successfully', v_order_id;

END $$;

COMMIT;


