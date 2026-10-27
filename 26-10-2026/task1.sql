-- CREATED TABLE FOR EMPLOYEES.....
CREATE TABLE employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
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

DROP TABLE EMPLOYEES

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

