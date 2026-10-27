SELECT * FROM DEPT ORDER BY ID;
SELECT * FROM EMP ORDER BY ID;
SELECT * FROM ATTENDANCE;
SELECT * FROM LEAVE_TYPES;
SELECT * FROM LEAVE_REQUESTS ORDER BY LEAVE_ID;
SELECT * FROM LEAVE_BALANCES;
SELECT * FROM SALARY_RECORDS;
-- Implement filtering, sorting, pagination, aggregate functions, and grouping.

-- FILTERNING.............................................................
SELECT * FROM EMP WHERE SALARY > 70000;

SELECT E.NAME , E.EMAIL , E.SALARY , D.NAME FROM EMP E INNER JOIN DEPT D ON E.DEPARTMENT_ID = D.ID  WHERE SALARY>70000;

-- ACTIVE EMPLOYEE IN IT DEPARTMENT 
SELECT NAME, DEPARTMENT_ID , IS_ACTIVE FROM EMP WHERE IS_ACTIVE=TRUE AND DEPARTMENT_ID=1;

-- EMPLOYEE BETWEEN 25 TO 35 YEAR OLD
SELECT NAME, AGE FROM EMP WHERE AGE BETWEEN 25 AND 35;

-- Employees whose designation contains Developer
SELECT NAME,DESIGNATION FROM EMP WHERE DESIGNATION ILIKE '%Developer%'; --TO MATCH ALL CASE USE IMATCH

-- SORTING..............................................
SELECT * FROM EMP ORDER BY  SALARY DESC;
SELECT * FROM EMP ORDER BY  JOINING_DATE DESC;
SELECT ID, NAME, DEPARTMENT_ID, SALARY FROM EMP ORDER BY DEPARTMENT_ID ASC, SALARY DESC;

-- PAGINATION
-- Suppose we display 10 employees per page.

SELECT ID, NAME , SALARY FROM EMP ORDER BY ID LIMIT 10 OFFSET 0;
-- WITH SKIP 10 THEN SHOW 10 RECODS
-- OFFSET = (page_number - 1) × page_size

SELECT ID, NAME , SALARY FROM EMP ORDER BY ID LIMIT 10 OFFSET 10;

-- filtering , sorting , pagination together 

SELECT * FROM EMP WHERE IS_aCTIVE=TRUE ORDER BY SALARY DESC LIMIT 5 OFFSET 0;

-- AGGREGATION FUNCTIONS.......................................................
SELECT COUNT(*) AS TOTAL_EMPLOYEES FROM EMP;

SELECT AVG(SALARY) AS average_salary FROM EMP;

SELECT MAX(SALARY) AS MAXIMUM_SALARY FROM EMP;
SELECT MIN(SALARY) AS MINIMUM_SALARY FROM EMP;

-- MULTIPLE AGGREGATION FUNCTION;
SELECT
    COUNT(*) AS total_employees,
    SUM(SALARY) AS total_salary,
    AVG(SALARY) AS average_salary,
    MIN(SALARY) AS minimum_salary,
    MAX(SALARY) AS maximum_salary
FROM EMP;

-- GROUP BY AND HAVING ...................................................................................................................................................................... 

SELECT DEPARTMENT_ID, COUNT(*) AS EMPLOYEE_COUNT FROM EMP GROUP BY DEPARTMENT_ID ORDER BY DEPARTMENT_ID;
-- Group by department with average salary

SELECT
	D.NAME AS DEPARTMENT_NAME,
    COUNT(E.ID) AS employee_count,
    AVG(SALARY) AS average_salary,
    MAX(SALARY) AS highest_salary,
    MIN(SALARY) AS lowest_salary
FROM DEPT D LEFT JOIN EMP E ON E.DEPARTMENT_ID = D.ID
GROUP BY D.ID, D.NAME
ORDER BY EMPLOYEE_COUNT DESC ;

-- DEPARTMENT HAVING MORE THAN 3 EMPLOYEES

SELECT D.NAME AS DEPARTMENT_NAME, COUNT(E.ID) AS EMPLOYEE_COUNT FROM DEPT D 
LEFT JOIN EMP E ON E.DEPARTMENT_ID = D.ID GROUP BY D.ID HAVING COUNT(E.ID)>=3 ORDER BY EMPLOYEE_COUNT DESC;

-- Departments whose average salary is greater than 70,000
SELECT
    D.NAME AS department_name,
    AVG(E.SALARY) AS average_salary
FROM DEPT D
INNER JOIN EMP E
    ON E.DEPARTMENT_ID = D.ID
GROUP BY D.ID, D.NAME
HAVING AVG(E.SALARY) > 70000
ORDER BY average_salary DESC;

-- CASE WHEN COALESCE , NULLIF ANDTYPE CASTING QUERIES............................................................................................

-- UPPERCASE
SELECT
    ID,
    UPPER(NAME) AS employee_name,
    DESIGNATION
FROM EMP;

-- LOWERCASE
SELECT ID , LOWER(NAME) AS employee_name , DESIGNATION FROM EMP;

-- GET LENGTH 
SELECT
    NAME,
    LENGTH(NAME) AS name_length
FROM EMP;

-- EXTRACT FIRST 3 CHARACTERS OF NAME 

SELECT NAME, SUBSTRING(NAME FROM 1 FOR 3) AS short_name FROM EMP;

-- Extract username from email
SELECT NAME , SPLIT_PART(EMAIL,'@',1) AS email_username FROM EMP;

-- Combine employee name and designation
SELECT
    CONCAT(NAME, ' - ', DESIGNATION) AS employee_details
FROM EMP;

-- CALCULATE EMPLOYEE EXPERIENCE 
 SELECT NAME , JOINING_DATE , AGE(CURRENT_DATE, JOINING_DATE) AS experience FROM EMP;

 -- Find employees who joined in 2022
 SELECT NAME , JOINING_DATE FROM EMP WHERE EXTRACT(YEAR FROM JOINING_DATE) = 2022;

 -- Find employees who joined in October
 SELECT NAME, JOINING_DATE FROM EMP WHERE EXTRACT(MONTH FROM JOINING_DATE)=10;

-- Group employees by joining month 
SELECT
    DATE_TRUNC('month', JOINING_DATE) AS joining_month,
    COUNT(*) AS employee_count
FROM EMP
GROUP BY DATE_TRUNC('month', JOINING_DATE)
ORDER BY joining_month;

-- Calculate number of days of a leave
SELECT LEAVE_ID, EMP_ID , START_DATE,END_DATE,(END_DATE-START_DATE+1) AS LEAVE_DAYS FROM LEAVE_REQUESTS

-- CASE WHEN ...........................................................................................................................................

-- Categorize employees by salary
SELECT
    NAME,
    SALARY,
    CASE
        WHEN SALARY >= 100000 THEN 'High'
        WHEN SALARY >= 60000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_level
FROM EMP;

-- Employee age category
SELECT NAME, AGE, CASE
                 WHEN AGE<25 THEN 'FRESHER'
				 WHEN AGE BETWEEN 25 AND 35 THEN 'MID-LEVEL'
				 ELSE 'EXPERIENCED'
			END AS EXPERIENCE_LEVEL FROM EMP;

-- Attendence status description

SELECT
    EMP_ID,
    WORK_DATE,
    STATUS,
    CASE
        WHEN STATUS = 'PRESENT' THEN 'Employee Present'
        WHEN STATUS = 'ABSENT' THEN 'Employee Absent'
        WHEN STATUS = 'HALF_DAY' THEN 'Half Day'
        WHEN STATUS = 'ON_LEAVE' THEN 'On Leave'
        WHEN STATUS = 'HOLIDAY' THEN 'Holiday'
    END AS status_description
FROM ATTENDANCE;

-- COLALESCE....................................................................
SELECT * FROM EMP WHERE EMAIL IS NULL;
UPDATE EMP SET EMAIL =NULL WHERE  ID IN(13,14)

-- NULL EMAIL SHOULD SHOW NO EMAIL
SELECT NAME , COALESCE(EMAIL, 'No Email') AS email , age , salary from EMP;

-- EMPLOYEE WITHOUT MANAGER ID SHOW NO MANAGER;

SELECT
    E.NAME AS employee_name,
    COALESCE(M.NAME, 'No Manager') AS manager_name
FROM EMP E
LEFT JOIN EMP M
    ON E.MANAGER_ID = M.ID;

-- PAYMENT DATE FOR UNPAID SALRY (COMBILE CONCEPT TYPE CONVERSION AND COALESCE)

SELECT EMP_ID, PAY_MONTH, PAY_YEAR , COALESCE(PAYMENT_DATE::TEXT,'NOT PAID') AS payment_date FROM SALARY_RECORDS;

-- NULLIF...........................................................................................................................................

SELECT
    SUM(SALARY) / NULLIF(COUNT(*), 0) AS average_salary
FROM EMP;


SELECT
    EMP_ID,
    LEAVE_TYPE_ID,
    ALLOCATED_DAYS,
    USED_DAYS,
    ROUND(
        USED_DAYS * 100.0 / NULLIF(ALLOCATED_DAYS, 0),
        2
    ) AS usage_percentage
FROM LEAVE_BALANCES;

-- TYPECASTING;

SELECT
    NAME,
    SALARY::NUMERIC(10,2) AS salary
FROM EMP;

SELECT
    NAME,
    JOINING_DATE::TEXT AS joining_date
FROM EMP;

SELECT
    EMP_ID,
    APPLIED_ON,
    APPLIED_ON::DATE AS application_date
FROM LEAVE_REQUESTS;

SELECT
    NAME,
    CAST(SALARY AS NUMERIC(10,2)) AS salary
FROM EMP;


-- SALARY REPORT CONSIST ALL TYPE CASTING CASE WHEN JOIN....................
SELECT
    S.EMP_ID,
    E.NAME,
    S.PAY_MONTH,
    S.PAY_YEAR,

    S.BASIC_SALARY::NUMERIC(10,2) AS basic_salary,

    (
        S.BASIC_SALARY
        + S.ALLOWANCES
        + S.BONUS
        - S.DEDUCTIONS
    )::NUMERIC(10,2) AS net_salary,

    ROUND(
        S.DEDUCTIONS * 100.0
        / NULLIF(S.BASIC_SALARY, 0),
        2
    ) AS deduction_percentage,

    COALESCE(S.PAYMENT_DATE::TEXT, 'Not Paid') AS payment_date,

    CASE
        WHEN S.PAYMENT_STATUS = 'PAID' THEN 'Salary Paid'
        WHEN S.PAYMENT_STATUS = 'PENDING' THEN 'Payment Pending'
        WHEN S.PAYMENT_STATUS = 'FAILED' THEN 'Payment Failed'
    END AS payment_status

FROM SALARY_RECORDS S
JOIN EMP E
    ON S.EMP_ID = E.ID
ORDER BY S.PAY_YEAR, S.PAY_MONTH, S.EMP_ID;
