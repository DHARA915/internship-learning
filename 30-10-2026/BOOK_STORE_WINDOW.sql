SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE' 
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

select * from orders;
select * from order_items;
select * from customers;

-- LEAD: For each order (per customer), show the next order’s date and calculate 
-- days between consecutive orders.

SELECT
    ID,
    CUSTOMER_ID,
    ORDER_DATE,

    LEAD(ORDER_DATE) OVER (
        PARTITION BY CUSTOMER_ID
        ORDER BY ORDER_DATE, ID
    ) AS NEXT_ORDER_DATE,

    LEAD(ORDER_DATE) OVER (
        PARTITION BY CUSTOMER_ID
        ORDER BY ORDER_DATE, ID
    )::DATE - ORDER_DATE::DATE AS DAYS_BETWEEN

FROM ORDERS

ORDER BY CUSTOMER_ID, ORDER_DATE;


-- Moving average: Calculate 3-order moving average of order totals using 
-- AVG OVER (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)

SELECT
    ID AS ORDER_ID,
    CUSTOMER_ID,
    ORDER_DATE,
    TOTAL_AMOUNT,

	ROUND(
        AVG(TOTAL_AMOUNT) OVER (
            PARTITION BY CUSTOMER_ID
			ORDER BY ORDER_DATE , ID
			ROWS BETWEEN 2 PRECEDING AND CURRENT ROW 
		), 2
	) AS MOVING_AVG
FROM ORDERS
ORDER BY CUSTOMER_ID , ORDER_DATE, ID;




