SELECT current_database();

CREATE TABLE details(
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
age INTEGER CHECK (age>=18),
phone VARCHAR(15),
is_active BOOLEAN DEFAULT TRUE,
birth_date DATE,
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
salary NUMERIC(10,2),
user_id UUID,
extra_details JSONB
);

INSERT INTO details
(name, email, age, phone, is_active, birth_date, salary, user_id, extra_details)
VALUES
('Dhara', 'dhara@gmail.com', 25, '9876543210', TRUE, '2001-05-15', 50000.00,
 '550e8400-e29b-41d4-a716-446655440000', '{"city":"Vadodara","role":"Developer"}'),

('Rahul', 'rahul@gmail.com', 30, '9876543211', TRUE, '1996-08-20', 65000.00,
 '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '{"city":"Ahmedabad","role":"Manager"}'),

('Priya', 'priya@gmail.com', 22, '9876543212', TRUE, '2004-02-10', 35000.00,
 '7c9e6679-7425-40de-944b-e07fc1f90ae7', '{"city":"Surat","role":"Designer"}'),

('Amit', 'amit@gmail.com', 28, '9876543213', TRUE, '1998-11-25', 55000.00,
 '16fd2706-8baf-433b-82eb-8c7fada847da', '{"city":"Mumbai","role":"Developer"}'),

('Neha', 'neha@gmail.com', 26, '9876543214', FALSE, '2000-03-18', 45000.00,
 '3d813cbb-47fb-4e6e-8d0e-9f1b8c7d6e5f', '{"city":"Pune","role":"Tester"}'),

('Vikas', 'vikas@gmail.com', 35, '9876543215', TRUE, '1991-07-12', 80000.00,
 '8f7e6d5c-4b3a-2918-1706-050403020100', '{"city":"Delhi","role":"Manager"}'),

('Anjali', 'anjali@gmail.com', 24, '9876543216', TRUE, '2002-09-05', 40000.00,
 'a1b2c3d4-e5f6-4789-abcd-ef0123456789', '{"city":"Rajkot","role":"Developer"}'),

('Karan', 'karan@gmail.com', 29, '9876543217', TRUE, '1997-12-30', 60000.00,
 'b2c3d4e5-f6a7-4890-bcde-f01234567890', '{"city":"Vadodara","role":"Analyst"}'),

('Pooja', 'pooja@gmail.com', 23, '9876543218', FALSE, '2003-06-22', 38000.00,
 'c3d4e5f6-a7b8-4901-cdef-012345678901', '{"city":"Surat","role":"Designer"}'),

('Rohit', 'rohit@gmail.com', 32, '9876543219', TRUE, '1994-10-14', 70000.00,
 'd4e5f6a7-b8c9-4012-def0-123456789012', '{"city":"Ahmedabad","role":"Developer"}');

 -- For EMPTY DETAILS TABLE
 TRUNCATE TABLE details.

SELECT * FROM details ORDER BY id;

-- ALTER TABLE......................................................................

-- ADD COLUMN
ALTER TABLE details ADD COLUMN department VARCHAR(50);
ALTER TABLE details ADD COLUMN country VARCHAR(50) DEFAULT 'India' ;

-- DROP COLUMN
ALTER TABLE details DROP COLUMN department;

-- RENAME COLUMN
ALTER TABLE details RENAME phone TO phone_number;
ALTER TABLE details RENAME phone_number TO phone;

-- UPDATE COLUMN FOR ADDING VALUES

UPDATE details SET department='IT' WHERE department IS NULL;

-- UPDATE DATA

UPDATE details SET SALARY=60000 WHERE NAME='Dhara';

-- ADD CONSTRAINT 

ALTER TABLE details ADD CONSTRAINT salarycheak CHECK (salary>0);

-- SHOW ERROR IF CONSTRAINT ADDED.
UPDATE details SET SALARY=-5000 WHERE NAME='Dhara'

-- REMOVE CONSTRAINT

ALTER TABLE details DROP CONSTRAINT salarycheak;
-- THIS WILL WORK BECAUSE CONSTRAINT REMOVED.
UPDATE details SET SALARY=-5000 WHERE NAME='Dhara'

