SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE' 
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- SELECT QUERIES

SELECT * FROM DEPT;
SELECT * FROM EMP ORDER BY ID;
-- Create a function get_employee_count(dept_name text) that returns the number of employees in that department.

CREATE OR REPLACE FUNCTION GET_EMPLOYEE_COUNT(
DEPT_NAME TEXT
)
RETURNS INTEGER
LANGUAGE PLPGSQL

AS $$

DECLARE 
   V_EMP_COUNT INTEGER;
BEGIN
SELECT COUNT(E.ID)
INTO V_EMP_COUNT
FROM EMP E 
INNER JOIN DEPT D
  ON E.DEPARTMENT_ID = D.ID
WHERE D.NAME = DEPT_NAME;

RETURN V_EMP_COUNT;
END;
$$;

SELECT GET_EMPLOYEE_COUNT('IT');
SELECT GET_EMPLOYEE_COUNT('HR');
SELECT GET_EMPLOYEE_COUNT('FINANCE');
SELECT GET_EMPLOYEE_COUNT('MARKETING');

-- Create a function get_department_employees(dept_name text) that RETURNS TABLE (name, salary, join_date) for all employees in that department.

CREATE OR REPLACE FUNCTION GET_DEPARTMENT_EMPLOYEES(
DEPT_NAME TEXT
)
RETURNS TABLE(
 NAME VARCHAR(100),
 SALARY INTEGER,
 JOIN_DATE DATE
)
LANGUAGE PLPGSQL
AS $$
BEGIN

RETURN QUERY

SELECT E.NAME , E.SALARY , E.JOINING_DATE FROM EMP E
INNER JOIN DEPT D 
ON E.DEPARTMENT_ID = D.ID
WHERE D.NAME = DEPT_NAME;

END;
$$;

SELECT * FROM GET_DEPARTMENT_EMPLOYEES('IT');
SELECT * FROM GET_DEPARTMENT_EMPLOYEES('HR');
SELECT * FROM GET_DEPARTMENT_EMPLOYEES('SALES');
SELECT * FROM GET_DEPARTMENT_EMPLOYEES('MARKETING');

-- Create a function format_salary(amount numeric) that 
-- returns salary as formatted text with commas (e.g., 1,50,000)

CREATE OR REPLACE FUNCTION FORMAT_SALARY(
AMOUNT NUMERIC
)
RETURNS TEXT
LANGUAGE PLPGSQL
AS $$
BEGIN

RETURN TO_CHAR(AMOUNT,'FM99,99,99,99,99,990');

END;
$$;

SELECT FORMAT_SALARY(5000);
SELECT FORMAT_SALARY(250000);
SELECT FORMAT_SALARY(1250000);

-- Create a function get_salary_stats(dept_name text, OUT min_sal 
-- numeric, OUT max_sal numeric, OUT avg_sal numeric) using OUT parameters.

CREATE OR REPLACE FUNCTION GET_SALARY_STATUS(
DEPT_NAME TEXT,
OUT MIN_SALARY NUMERIC,
OUT MAX_SALARY NUMERIC,
OUT AVG_SALARY NUMERIC
)
LANGUAGE PLPGSQL
AS $$
BEGIN

SELECT MIN(E.SALARY),
       MAX(E.SALARY),
       AVG(E.SALARY)
	   INTO
	    MIN_SALARY,
		MAX_SALARY,
		AVG_SALARY
	 FROM EMP E
	 INNER JOIN DEPT D
	  ON E.DEPARTMENT_ID = D.ID
   WHERE D.NAME = DEPT_NAME;
END;
$$;


SELECT * FROM GET_SALARY_STATUS('IT');
SELECT * FROM GET_SALARY_STATUS('HR');
SELECT * FROM GET_SALARY_STATUS('DEPARTMENT');

-- Create a function with IF/ELSE: get_employee_grade(salary numeric)
-- returns ‘A’ for > 100000, ‘B’ for 50000-100000, ‘C’ for < 50000

CREATE OR REPLACE FUNCTION GET_EMPLOYEE_GRADE(
SALARY NUMERIC
)
RETURNS VARCHAR(1)
LANGUAGE PLPGSQL
AS $$
BEGIN


IF SALARY>100000 THEN
    RETURN 'A';

ELSIF SALARY >=50000 AND SALARY <= 100000 THEN
    RETURN 'B';

ELSE
    RETURN 'C';

END IF;	

END;
$$;

SELECT * FROM  GET_EMPLOYEE_GRADE(110000);
SELECT * FROM  GET_EMPLOYEE_GRADE(65000);
SELECT * FROM  GET_EMPLOYEE_GRADE(40000)

-- Create a function using LOOP: give_increments
-- (dept_name text, percentage numeric) - loops through employees in 
-- that department, increases salary, returns count of updated employees

CREATE OR REPLACE FUNCTION GIVE_INCREMENTS(
 DEPT_NAME TEXT,
 PERCENTAGE NUMERIC
)
RETURNS INTEGER
LANGUAGE PLPGSQL
AS $$
DECLARE
    V_EMP_ID INTEGER;
	V_UPDATED_COUNT INTEGER:=0;
BEGIN
  FOR V_EMP_ID IN 
	  SELECT E.ID FROM EMP E
	INNER JOIN DEPT D 
	      ON E.DEPARTMENT_ID = D.ID
    WHERE D.NAME = DEPT_NAME
  
  LOOP

    UPDATE EMP SET SALARY= SALARY + (SALARY*PERCENTAGE/100)
	WHERE ID = V_EMP_ID;

	V_UPDATED_COUNT:=V_UPDATED_COUNT+1;

 END LOOP;

 RETURN V_UPDATED_COUNT;

 END;
 $$;

SELECT GIVE_INCREMENTS('IT', 10);

SELECT
    E.ID,
    E.NAME,
    E.SALARY,
    D.NAME AS DEPARTMENT
FROM EMP E
INNER JOIN DEPT D
    ON E.DEPARTMENT_ID = D.ID
WHERE D.NAME = 'IT';

-- Create a function with exception handling: safe_insert_employee(...)
-- that catches unique_violation and returns a message instead of failing

CREATE OR REPLACE FUNCTION SAFE_INSERT_EMPLOYEE(
    P_ID INTEGER,
    P_NAME VARCHAR(100),
    P_EMAIL VARCHAR(255),
    P_AGE INTEGER,
    P_SALARY INTEGER,
    P_DEPARTMENT_ID INTEGER
)
RETURNS TEXT
LANGUAGE PLPGSQL
AS $$
BEGIN

    INSERT INTO EMP (
        ID,
        NAME,
        EMAIL,
        AGE,
        SALARY,
        DEPARTMENT_ID
    )
    VALUES (
        P_ID,
        P_NAME,
        P_EMAIL,
        P_AGE,
        P_SALARY,
        P_DEPARTMENT_ID
    );

    RETURN 'Employee inserted successfully';

EXCEPTION
    WHEN unique_violation THEN
        RETURN 'Error: Employee email already exists';

END;
$$;

-- TEST
SELECT SAFE_INSERT_EMPLOYEE(
    22,
    'Dhara',
    'dhara_test@gmail.com',
    21,
    30000,
    1
);

-- ERROR: EMPLOYEE EMAIL ALREADY EXISTS
SELECT SAFE_INSERT_EMPLOYEE(
    23,
    'Rahul',
    'dhara_test@gmail.com',
    25,
    40000,
    1
);

------------------------------------------------------------------------- TRIGGER --------------------------------------------------------------------------------------

-- Create a trigger: BEFORE INSERT on employees, 
-- auto-trim whitespace from name and lowercase the email

-- TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION CLEAN_EMPLOYEE_DATA()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$

BEGIN 

-- REMOVE WHITE SPACE (TRIM) FROM NAME

 NEW.NAME := TRIM(NEW.NAME);

 -- CONVERT EMAIL INTO LOWERCASE

 NEW.EMAIL := LOWER(NEW.EMAIL);

 RETURN NEW;

END;
$$;

-- CREATE TRIGGER
CREATE TRIGGER BEFORE_EMPLOYEE_INSERT
BEFORE INSERT   -- EXECUTES THE FUNCTION BEFORE INSERTING THE ROW.
ON EMP          -- ATTACHES THE TRIGGER TO THE EMP TABLE.
FOR EACH ROW    -- EXECUTES ONCE FOR EVERY ROW BEING INSERTED.
EXECUTE CLEAN_EMPLOYEE_DATA();

-- TEST TRIGGER

INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY)
VALUES (23, '   Dhara Patel   ', 'DHARA@GMAIL.COM', 22, 30000)
RETURNING *; 

-- Create a trigger: BEFORE INSERT on employees, auto-generate an employee_code
-- using department prefix + sequence (e.g., ENG-001)




-- FIND THE NEXT SEQUENCE NUMBER 

-- CREATE TRIGGER
CREATE OR REPLACE FUNCTION GENERATE_EMPLOYEE_CODE()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
DECLARE
    V_PREFIX VARCHAR(3);
    V_SEQUENCE INTEGER;
BEGIN

    -- Get department prefix
    SELECT LEFT(UPPER(NAME), 3)
    INTO V_PREFIX
    FROM DEPT
    WHERE DEPT.ID = NEW.DEPARTMENT_ID;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid department ID: %',
            NEW.DEPARTMENT_ID;
    END IF;

    -- Find the next sequence number
    SELECT COALESCE(
        MAX(SPLIT_PART(EMPLOYEE_CODE, '-', 2)::INTEGER),
        0
    ) + 1
    INTO V_SEQUENCE
    FROM EMP
    WHERE EMPLOYEE_CODE LIKE V_PREFIX || '-%';

    -- Generate employee code
    NEW.EMPLOYEE_CODE :=
        V_PREFIX || '-' || LPAD(V_SEQUENCE::TEXT, 3, '0');

    RETURN NEW;

END;
$$;

-- CREATE TRIGGER

CREATE TRIGGER BEFORE_EMPLOYEE_INSERT
BEFORE INSERT 
ON EMP 
FOR EACH ROW 
EXECUTE FUNCTION GENERATE_EMPLOYEE_CODE()

-- TEST:
INSERT INTO EMP(
ID,
NAME,
EMAIL,
AGE,	
SALARY,
DEPARTMENT_ID
)
VALUES(
  24,
 'Priya Shah',
 'priya103@gmail.com',
  23,
  32000,
  2
)

RETURNING *;

INSERT INTO EMP (
    ID,
    NAME,
    EMAIL,
    AGE,
    SALARY,
    DEPARTMENT_ID
)
VALUES
    (25, 'Rahul Patel', 'rahul125@gmail.com', 25, 35000, 1),
    (26, 'Amit Shah', 'amit126@gmail.com', 24, 30000, 1),
    (27, 'Neha Patel', 'neha127@gmail.com', 26, 40000, 3),
    (28, 'Karan Mehta', 'karan128@gmail.com', 27, 45000, 2),
    (29, 'Riya Desai', 'riya129@gmail.com', 22, 28000, 3),
    (30, 'Priya Shah', 'priya130@gmail.com', 23, 32000, 2)
RETURNING *;

INSERT INTO EMP (
    ID,
    NAME,
    EMAIL,
    AGE,
    SALARY,
    DEPARTMENT_ID
)
VALUES
    (31, 'Anjali Patel', 'anjali31@gmail.com', 23, 30000, 1),
    (32, 'Rohan Shah', 'rohan32@gmail.com', 25, 35000, 1),
    (33, 'Kavya Mehta', 'kavya33@gmail.com', 24, 32000, 2),
    (34, 'Vishal Desai', 'vishal34@gmail.com', 27, 42000, 3),
    (35, 'Mira Joshi', 'mira35@gmail.com', 26, 38000, 2)
RETURNING *;