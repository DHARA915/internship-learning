SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE' 
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

SELECT * FROM EMP ORDER BY ID;
SELECT * FROM DEPT;

-- QUESTION:1   CTE: Get department stats (avg salary) as a CTE, 
-- then join with employees to show each employee alongside 
-- their department average

-- ANCHOR QUERY
WITH DEPT_STATS AS (

 SELECT DEPARTMENT_ID , ROUND(AVG(SALARY)) AS AVG_SALARY
 FROM EMP 
 WHERE DEPARTMENT_ID IS NOT NULL
 GROUP BY DEPARTMENT_ID
)


-- JOIN DEPARTMENT AVG SALARY WITH EMP

SELECT E.ID AS EMP_ID , E.NAME AS EMP_NAME , E.SALARY , D.NAME AS DEPARTMENT,
DS.AVG_SALARY AS DEPT_AVG_SALARY

FROM EMP E
INNER JOIN DEPT_STATS DS
ON E.DEPARTMENT_ID =  DS.DEPARTMENT_ID

INNER JOIN DEPT D
    ON E.DEPARTMENT_ID = D.ID

ORDER BY D.ID , E.ID;

-- QUESTION:2  CTE: Chain two CTEs - first get top 3 departments by headcount,
-- then get all employees in those departments with their salary rank.

WITH DEPT_HEADCOUNT AS (
  -- CTE1  : Count employee in each department
  SELECT DEPARTMENT_ID , COUNT(*) AS TOTAL_EMPLOYEES FROM EMP
  WHERE DEPARTMENT_ID IS NOT NULL GROUP BY DEPARTMENT_ID
),

TOP3_DEPTS AS (
-- CTE 2 :Get top 3 department by headcount;

SELECT DH.DEPARTMENT_ID, D.NAME AS DEPARTMENT , DH.TOTAL_EMPLOYEES FROM DEPT_HEADCOUNT DH
INNER JOIN DEPT D ON DH.DEPARTMENT_ID = D.ID ORDER BY DH.TOTAL_EMPLOYEES DESC,D.ID
LIMIT 3
)

-- MAIN QUERY : Get employees and their salary rank

SELECT
    E.ID AS EMP_ID,
    E.NAME AS EMP_NAME,
    E.SALARY,
    T.DEPARTMENT,
    T.TOTAL_EMPLOYEES,
    RANK() OVER (
        PARTITION BY E.DEPARTMENT_ID
        ORDER BY E.SALARY DESC
    ) AS SALARY_RANK

FROM EMP E

INNER JOIN TOP3_DEPTS T
    ON E.DEPARTMENT_ID = T.DEPARTMENT_ID

ORDER BY T.DEPARTMENT, SALARY_RANK, E.ID; 

-- QUESTION:3 Recursive CTE: Add a manager_id column to employees if not
-- already present. Write a recursive query to show full reporting chain
-- from top manager down with level number

WITH RECURSIVE EMP_HIERARCHY AS (
-- ANCHOR QUERY

SELECT E.ID , E.NAME , E.MANAGER_ID , 0 AS LEVEL , ARRAY[E.ID] AS ID_PATH
FROM EMP E WHERE E.MANAGER_Id IS NULL

UNION ALL

-- RECURSIVE : FIND EMPLOYEES REPORTING TO PREVIOUS EMPLOYEES

SELECT E.ID, E.NAME , E.MANAGER_ID, H.LEVEL + 1 ,  H.ID_PATH || E.ID
FROM EMP E INNER JOIN EMP_HIERARCHY H  ON E.MANAGER_ID = H.ID
     WHERE NOT E.ID = ANY(H.ID_PATH) -- Circle prevention condition.
)
-- Main query
SELECT
    H.ID AS EMP_ID,
    H.NAME AS EMP_NAME,
    M.NAME AS MANAGER_NAME,
    H.MANAGER_ID,
    H.LEVEL,
    ARRAY_TO_STRING(H.ID_PATH, ' -> ') AS REPORTING_PATH

FROM EMP_HIERARCHY H

LEFT JOIN EMP M
    ON H.MANAGER_ID = M.ID

ORDER BY H.ID_PATH;

-- Recursive CTE: Generate a series of all dates for the current month
-- (day 1 to last day) without using generate_series

WITH RECURSIVE MONTH_DATE AS (

SELECT DATE_TRUNC('MONTH', CURRENT_DATE)::DATE AS DAY_DATE

UNION ALL

SELECT DAY_DATE +1
  FROM MONTH_DATE
  WHERE DAY_DATE < (
   DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH - 1 DAY'
  )::DATE

)

SELECT * FROM MONTH_DATE;

SELECT 
COUNT(*) AS TOTAL_DAYS,
MIN(DAY_DATE) AS FIRST_DATE,
MAX(DAY_DATE) AS LAST_DATE
 FROM MONTH_DATE;

-- ROW_NUMBER: Assign a row number to all employees ordered by salary DESC within each department
-- ROW NUMBER GENERATE NUMBER IN ORDER WITHOUT SKIP AND SAME NUMBER 

SELECT ID , DEPARTMENT_ID , NAME , SALARY , 
  ROW_NUMBER() OVER (
   ORDER BY SALARY DESC
  ) AS ROW_NUM
FROM EMP;

-- Use ROW_NUMBER in a subquery to find the 2nd highest paid employee in each department

SELECT *
FROM (
    SELECT
        E.ID,
        E.NAME,
        E.SALARY,
        E.DEPARTMENT_ID,
        ROW_NUMBER() OVER (
            PARTITION BY E.DEPARTMENT_ID
            ORDER BY E.SALARY DESC
        ) AS ROW_NUM
    FROM EMP E
) AS EMP_RANK
WHERE ROW_NUM = 2;

-- WINDOW FUNCTIONS..........................................................................................................

-- RANK vs DENSE_RANK: Insert two employees with identical salary.
-- Rank all employees by salary - show the difference between RANK and 
-- DENSE_RANK output


-- USING ROW_NUMBER
SELECT ID , NAME , DEPARTMENT_ID , SALARY ,
   ROW_NUMBER() OVER (
    ORDER BY SALARY DESC
   ) AS SALARY_RANK
FROM EMP;

-- USING RANK
SELECT ID , NAME , DEPARTMENT_ID , SALARY ,
   RANK() OVER (
    ORDER BY SALARY DESC
   ) AS SALARY_RANK
FROM EMP;

-- USING DENSE_RANK
SELECT ID , NAME , DEPARTMENT_ID , SALARY ,
   DENSE_RANK() OVER (
    ORDER BY SALARY DESC
   ) AS SALARY_RANK
FROM EMP;

-- LAG: For each employee (ordered by join_date), 
-- show their salary alongside the previous employee’s salary 
-- and the difference between them

SELECT ID , NAME , DEPARTMENT_ID ,SALARY , 
LAG(SALARY) OVER (
ORDER BY JOINING_DATE
)AS PREVIOUS_SALARY,

SALARY - LAG(SALARY) OVER (
ORDER BY JOINING_DATE
)AS SALARY_DIFFERENCE

FROM EMP;

-- Running total: Use SUM(salary) OVER (ORDER BY join_date) to show cumulative salary
-- cost as employees were hired

-- APPROACH: Sort employees by their joining date.
-- Start with the first employee's salary.
-- Add the next employee's salary to the previous total.
-- Continue until the last employee.

SELECT ID , NAME , JOINING_DATE , SALARY, 
SUM(SALARY) OVER (
ORDER BY JOINING_DATE , ID
) AS RUNNING_TOTAL

FROM EMP
ORDER BY JOINING_DATE;

-- PARTITION BY: Show each employee’s salary as percentage
-- of their department’s total salary.

SELECT ID , NAME , DEPARTMENT_ID , SALARY, 
  SUM(SALARY) OVER (
        PARTITION BY DEPARTMENT_ID 
  ) AS DEPARTMENT_TOTAL_SALARY,

 ROUND(
     SALARY*100.0/
	 SUM(SALARY) OVER (
        PARTITION BY DEPARTMENT_ID
	 ),
	 2
 ) AS SALARY_PERCENTAGE

FROM EMP
ORDER BY DEPARTMENT_ID , ID ;

-- UNION , UNOIN ALL , EXCEPT .................................................................................................................................

-- UNION...
SELECT NAME FROM EMP UNION SELECT NAME FROM DEPT ORDER BY NAME;

-- UNION ALL...
SELECT NAME FROM EMP UNION ALL SELECT NAME FROM DEPT ORDER BY NAME;

-- EXCEPT...

SELECT EMAIL
FROM EMP
WHERE EMAIL IS NOT NULL

EXCEPT

SELECT DISTINCT M.EMAIL
FROM EMP E
INNER JOIN EMP M
    ON E.MANAGER_ID = M.ID
WHERE M.EMAIL IS NOT NULL;

