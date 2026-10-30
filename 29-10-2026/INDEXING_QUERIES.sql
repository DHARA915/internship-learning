SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- SHOW WHICH SCAN EXECUTED
EXPLAIN
SELECT * FROM EMP;

-- SHOW ALL EXECUTION DETAILS OF QUERY
EXPLAIN ANALYZE 
SELECT * FROM EMP;

-- CREATE INDEX ON EMP(DEPARTMENT)
CREATE INDEX emp_deptId ON EMP(DEPARTMENT_ID);

-- ACCESS ALL EMPLOYEE DEPARTMENT 

-- OFF SEQ_SCAN MANUALLY TO UNDERSTAND INDEX SCAN BECAUSE HERE TABLE IS SMALL SO
-- POSTGRESQL TAKE SEQ_SCAN INSTED OF INDEX SCAN.  

SET enable_seqscan = OFF;

EXPLAIN ANALYZE 
SELECT * FROM EMP WHERE DEPARTMENT_ID = 1;

-- ON SEQ_SCAN AGAIN .
SET enable_seqscan = ON;

-- Create a composite index on employees(department, salary) - query employees in Engineering with salary > 50000, check plan

CREATE INDEX idx_empdept_salary ON EMP(DEPARTMENT_ID,SALARY);

EXPLAIN ANALYZE
SELECT * FROM EMP WHERE DEPARTMENT_ID = 1 AND SALARY > 50000;

EXPLAIN ANALYZE
SELECT * FROM EMP WHERE SALARY > 50000 AND DEPARTMENT_ID = 1 ;

EXPLAIN ANALYZE
SELECT * FROM DEPT;


-- VIEW - AUTOMATICALLY UPDATE VALUES IN VIEW TABLE WHEN DATABASE TABLE UPDATED.............................................................

CREATE VIEW  employee_summary AS
SELECT E.NAME as employee_name,
       D.NAME as department_name,
	   E.SALARY as salary,
	   CASE
	   WHEN E.SALARY >=  100000 THEN 'HIGH'
	   WHEN E.SALARY >= 50000 THEN 'MEDIUM'
	   ELSE 'LOW'
	 END AS salary_category
FROM EMP E LEFT JOIN DEPT D ON E.DEPARTMENT_ID = D.ID;

-- SELECT FROM VIEW TABLE
SELECT * FROM EMPLOYEE_SUMMARY;

UPDATE  EMP SET SALARY = 50000 WHERE ID=13 RETURNING * ;

-- SELECT from the view, filter by department
SELECT * FROM EMPLOYEE_SUMMARY WHERE DEPARTMENT_NAME='IT';

-- Create a VIEW 'department_stats' showing: department name, employee count, avg salary, min salary, max salary
CREATE VIEW department_stats AS
SELECT D.NAME AS department_name, COUNT(E.ID) AS total_employees,
AVG(E.SALARY) AS average_salary , MIN(E.SALARY) AS minimum_salary , MAX(E.SALARY) AS maximum_salary
FROM DEPT D LEFT JOIN EMP E ON D.ID = E.DEPARTMENT_ID
GROUP BY D.ID, D.NAME;

SELECT * FROM department_stats;


