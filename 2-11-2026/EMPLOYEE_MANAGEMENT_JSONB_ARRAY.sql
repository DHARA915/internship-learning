-- METADAT , UNNEST , ARRAY_AGG...

-- TASK : 30/11/2026
-- QUESTION:9  Use array_agg(name) to get all employee names per department as a single array

SELECT DEPARTMENT_ID , ARRAY_AGG(NAME) AS EMPLOYEE_NAMES FROM EMP GROUP BY DEPARTMENT_ID ORDER BY DEPARTMENT_ID; 

-- QUESTION : 10 Create ENUM: CREATE TYPE priority_level AS ENUM
-- ('low', 'medium', 'high', 'critical'). Add a priority column to a table using it.
-- Try inserting an invalid value - observe the error.

-- ENUM VALUES ARE CASE SENSITIVE
CREATE TYPE priority_level AS ENUM (
   'low',
   'medium',
   'high'
);

-- ADD PRIORITY COLUMN TO EMP

ALTER TABLE EMP
ADD COLUMN PRIORITY priority_level  DEFAULT 'medium';

SELECT * FROM EMP ORDER BY ID;

-- THIS WILL WORK (CASE SENSITIVE)
UPDATE EMP SET PRIORITY = 'low' WHERE ID = 1;

UPDATE EMP SET PRIORITY = 'high' WHERE ID = 1 returning *;

-- ERROR:  invalid input value for enum priority_level: "critical"
 
UPDATE EMP SET PRIORITY = 'critical' WHERE ID = 1 returning *;

