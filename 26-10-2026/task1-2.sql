-- CREATED TABLE FOR EMPLOYEES.....
CREATE TABLE employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    age INTEGER CHECK (age >= 18),
    salary NUMERIC(10,2) CHECK(salary>0),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    joining_date DATE DEFAULT CURRENT_DATE
);

-- CREATE TABLE FOR DEPARTMENT......
CREATE TABLE departments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (name, description)
VALUES
('IT', 'Information Technology department'),
('HR', 'Human Resources department'),
('Finance', 'Finance and accounting department'),
('Marketing', 'Marketing and brand management department'),
('Sales', 'Sales and business development department');

INSERT INTO employees (name, email, age, salary, department)
VALUES
('Dhara', 'dhara@example.com', 25, 60000.00, 'IT'),
('Rahul', 'rahul@example.com', 28, 55000.00, 'HR'),
('Dhara', 'testdhara@example.com', 25, 60000.00, 'IT'),
('Priya', 'priya@example.com', 30, 70000.00, 'Finance'),
('Amit', 'amit@example.com', 27, 50000.00, 'Marketing'),
('Neha', 'neha@example.com', 29, 65000.00, 'Sales');

INSERT INTO employees
    (name, email, age, salary, department)
VALUES
    ('Karan', 'karan@example.com', 24, 25000, 'IT'),
    ('Sneha', NULL, 26, 42000, 'IT'),
    ('Vikram', 'vikram@example.com', 32, 95000, 'IT'),

    ('Anjali', 'anjali@example.com', 29, 38000, 'HR'),
    ('Rohan', NULL, 31, 72000, 'HR'),
    ('Mehul', 'mehul@example.com', 35, 110000, 'HR'),

    ('Pooja', 'pooja@example.com', 27, 45000, 'Finance'),
    ('Nikhil', NULL, 33, 85000, 'Finance'),
    ('Sonia', 'sonia@example.com', 38, 150000, 'Finance'),

    ('Yash', 'yash@example.com', 25, 30000, 'Marketing'),
    ('Tina', NULL, 28, 60000, 'Marketing'),
    ('Varun', 'varun@example.com', 34, 125000, 'Marketing'),

    ('Isha', 'isha@example.com', 23, 35000, 'Sales'),
    ('Manish', NULL, 30, 78000, 'Sales'),
    ('Aakash', 'aakash@example.com', 36, 135000, 'Sales');

-- INSERT 3 DETAILS WITH MULTICOLUMN VALUE WITH RETURNING.
INSERT INTO employees (name,email,age,salary,department)
VALUES ('Riya', 'riya@example.com', 26, 55000, 'IT'),
       ('Arjun', NULL, 29, 90000, 'Finance'),
       ('Maya', 'maya@example.com', 27, 65000, 'Sales')
RETURNING *;

-- ADD INACTIVE EMPLOYEES
INSERT INTO employees (name, email,age , salary , department , is_active)
VALUES ('Raj', 'raj@example.com', 28, 45000, 'IT', FALSE),
       ('Simran', NULL, 31, 60000, 'HR', FALSE),
       ('Kabir', 'kabir@example.com', 35, 85000, 'Marketing', FALSE);


DROP TABLE EMPLOYEES

DROP TABLE DEPARTMENTS

SELECT * FROM EMPLOYEES ORDER BY ID;

SELECT * FROM DEPARTMENTS ORDER BY ID;

-- ADD A PHONE COLUMN TO EMPLOYEE
ALTER TABLE employees ADD COLUMN PHONE VARCHAR(10)

-- rename phon column to employee
ALTER TABLE employees RENAME COLUMN phone TO contact_number;

-- Drop contact number column 
ALTER TABLE employees DROP COLUMN contact_number;


-- ADD COMPOSITE UNIQUE KEY
ALTER TABLE employees ADD CONSTRAINT composite_emp_dept UNIQUE(name,department) 

-- DELETE TUPLE
DELETE FROM employees WHERE EMAIL='testdhara@example.com';

-- AFTER ADD COMPOSITE KEY TRY TO ADD SAME NAME + DEPT; (show error message...)
INSERT INTO employees (name, email, age, salary, department) VALUES ('Dhara', 'testdhara@example.com', 25, 60000.00, 'IT');

-- FOR ADDING FOREIGN KEY FROM EMPLOYEE(DEPARTMENT) TO DEPARTMENT(NAME)

ALTER TABLE employees DROP CONSTRAINT FK_EMP_DEPT
ALTER TABLE employees ADD CONSTRAINT FK_EMP_DEPT FOREIGN KEY (DEPARTMENT) REFERENCES  DEPARTMENTS(NAME);

-- .........................................FOR AUDIT_LOG TABLE........................................................................................
CREATE TABLE audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_success BOOLEAN DEFAULT TRUE
);

INSERT INTO audit_log
(action, table_name, record_id, description)
VALUES
('INSERT', 'employees', 1, 'New employee created'),
('UPDATE', 'employees', 2, 'Employee salary updated'),
('DELETE', 'employees', 3, 'Employee record deleted'),
('INSERT', 'employees', 4, 'New employee created'),
('UPDATE', 'employees', 5, 'Employee department updated');

SELECT * FROM audit_log ORDER BY ID;

-- TRUNCATE
TRUNCATE TABLE audit_log;
-- DROP 
DROP TABLE audit_log;

-- ........................................ FOR PROJECT TABLE................................................................................

CREATE TABLE projects (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'planned',
start_date DATE NOT NULL,
end_date DATE,

CONSTRAINT status_cheak
            CHECK(status IN ('planned', 'active' , 'completed', 'cancelled')),
CONSTRAINT date_cheak
            CHECK(end_date IS NULL OR end_date>=start_date)
);

INSERT INTO projects
(name, status, start_date, end_date)
VALUES
('Website Development', 'active', '2026-10-01', '2026-12-31'),
('Mobile App', 'planned', '2026-11-01', '2027-02-28'),
('Database Migration', 'completed', '2026-01-10', '2026-03-15'),
('Old Project', 'cancelled', '2026-04-01', NULL);

select * from projects ORDER BY ID;

DROP TABLE PROJECTS;

-- EMPLOYEE AND DEPARTMENT QUERIES....

-- SELECT all employees, show only name, department, salary, alias salary as 'monthly_pay'
SELECT * FROM employees ORDER BY ID;

SELECT name , department , salary As monthly_pay from employees;

-- SELECT DISTINCT departments from employees table
SELECT DISTINCT department from employees;

-- Find all employees where salary BETWEEN 50000 AND 100000
SELECT name, salary from employees where salary BETWEEN 50000 AND 100000;

-- Find employees whose name starts with 'A' or 'S' using LIKE
SELECT name from employees WHERE name LIKE 'A%' OR name LIKE 'S%';

-- Find employees whose email IS NULL
SELECT * from employees WHERE email is NULL;

-- Find employees in IT OR Marketing with salary > 60000
SELECT name , department , salary from employees WHERE (department='IT' OR  department='Marketing') AND SALARY > 60000;
select name , department , salary from employees WHERE department in ('IT','MARKETING') AND SALARY > 60000;

-- Find employees NOT IN ('HR', 'Finance') departments, ordered by salary DESC

SELECT name, department,salary from employees WHERE department NOT IN('HR','FINANCE') ORDER BY SALARY DESC;

-- UPDATE salary by 10% for all employees in Engineering, return their names and new salary

UPDATE employees SET SALARY=SALARY*1.10 WHERE DEPARTMENT='IT'
RETURNING *;

-- DELETE employees where is_active = false (insert a few inactive ones first)
SELECT name , is_Active from employees where is_active = false;

DELETE FROM employees where is_active=false;

-- INSERT a new employee with ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
INSERT INTO employees (name, email, age, salary, department) VALUES ('DharaP', 'dhara@example.com', 25, 70000.00, 'IT')
ON CONFLICT (email)
DO UPDATE 
SET name= EXCLUDED.name
RETURNING * ;

-- SELECT top 5 highest paid employees, then next 5 (OFFSET 5 LIMIT 5)
SELECT * FROM employees ORDER BY SALARY DESC OFFSET 5 LIMIT 5;

-- Order employees by department ASC, then salary DESC, NULLS LAST
SELECT name , department , salary ,email FROM employees ORDER BY department ASC,salary DESC;
SELECT name , department , salary ,email FROM employees ORDER BY department ASC , salary DESC NULLS LAST;

-- SQL STRING FUNCTIONS................................................................................................................................

SELECT 
      CONCAT('Dhara',' ', 'Patel') AS full_name,
	  LENGTH ('Dhara') AS length,
	  UPPER('dhara') AS uppercase,
	  LOWER('DHARA') AS Lowercase,
	  TRIM('  Dhara  ') AS  TRIMMED,
	  SUBSTRING('Dhara' From 1 FOR 3 ) AS SUBSTRING,
	  SPLIT_PART('Dhara@GM@AIL.COM','@',3) as email_name,
	  REPLACE('Hello World','World', 'DHARA') as repalced;

SELECT name, UPPER(name) AS upper_Case_name,LENGTH(name) AS name_length FROM employees;
-- ....................................................................................................................................................

-- SQL DATE FUNCTIONS..........................................................................................................................
SELECT NOW();
SELECT CURRENT_DATE;

SELECT AGE('2026-10-26','2005-01-09');
-- FOR EXTARCTING YEAR , MONTH AND DAY RFOM CURRENT_DATE
SELECT EXTRACT(YEAR FROM CURRENT_DATE);
SELECT EXTRACT(MONTH FROM CURRENT_DATE);
SELECT EXTRACT(DAY FROM CURRENT_DATE);

SELECT
    DATE_TRUNC('year', '2026-10-26 18:30:00'::timestamp) AS year,
    DATE_TRUNC('month', '2026-10-26 18:30:00'::timestamp) AS month,
    DATE_TRUNC('day', '2026-10-26 18:30:00'::timestamp) AS day,
    DATE_TRUNC('hour', '2026-10-26 18:30:00'::timestamp) AS hour;

-- TASK 2.......................................................................................................................................................................

-- Count total employees
SELECT COUNT(NAME) FROM employees;

-- Count employees per department
SELECT  DEPARTMENT,COUNT(NAME) from employees GROUP BY DEPARTMENT;

-- Find average salary per department
SELECT DEPARTMENT, AVG(SALARY) FROM employees GROUP BY DEPARTMENT;

-- Find department with highest total salary (SUM + ORDER BY + LIMIT 1)
SELECT DEPARTMENT , MAX(SALARY) AS total_salary FROM employees GROUP BY DEPARTMENT ORDER BY total_salary DESC LIMIT 1;

-- Find departments having more than 3 employees (GROUP BY + HAVING)
SELECT DEPARTMENT FROM employees GROUP BY DEPARTMENT HAVING COUNT(*)>3;

-- Find MIN and MAX salary across the company
SELECT MIN(SALARY) AS MINIMUM_SALARY , MAX(SALARY) AS MAXIMUM_SALARY FROM employees;

-- Use CASE WHEN to categorize employees: salary < 40000 = 'Junior', 40000-80000 = 'Mid', > 80000 = 'Senior'

SELECT NAME, DEPARTMENT, SALARY, 
                         CASE
						 WHEN SALARY<40000 THEN 'JUNIOR'
						 WHEN SALARY BETWEEN 40000 AND 80000 THEN 'MID'
						 ELSE 'SENIOR'
						 END AS salary_category
			                                   FROM employees ORDER BY DEPARTMENT ASC ;		

-- Use COALESCE to show 'No Email' for employees with NULL email
SELECT name , COALESCE(email,'No Email') As email FROM employees;

-- Use NULLIF to avoid division by zero: divide total salary by NULLIF(count, 0)
SELECT SUM(salary)/NULLIF(COUNT(*),0) AS average_salary FROM employees;

-- CONCAT first 3 characters of department with employee id to create an 'employee_code'
SELECT name,department, CONCAT(SUBSTRING(department from 1 FOR 3),id) AS employee_code from employees;

-- UPPER all employee names, TRIM any whitespace
SELECT UPPER(TRIM(name)) AS employee_name FROM employees;

-- Find length of each employee name, order by longest first
SELECT
    name,
    LENGTH(name) AS name_length
FROM employees
ORDER BY name_length DESC;

-- Use SPLIT_PART to extract domain from email addresses (split on '@', take part 2)
SELECT
    name,
    email,
    SPLIT_PART(email, '@', 2) AS email_domain
FROM employees;

-- Extract year and month 
SELECT
    name,
    EXTRACT(YEAR FROM joining_date) AS joining_year,
    EXTRACT(MONTH FROM joining_date) AS joining_month
FROM employees;

-- Find employees who joined in the current year using DATE_TRUNC
SELECT *
FROM employees
WHERE joining_date >= DATE_TRUNC('year', CURRENT_DATE);

-- Cast salary to integer using ::int, cast join_date to text using ::text
SELECT
    name,
    salary::int AS salary_integer,
    joining_date::text AS joining_date_text
FROM employees;

-- Count employees who joined per month (GROUP BY DATE_TRUNC('month', join_date))
SELECT
    DATE_TRUNC('month', joining_date) AS joining_month,
    COUNT(*) AS employee_count
FROM employees
GROUP BY DATE_TRUNC('month', joining_date)
ORDER BY joining_month;