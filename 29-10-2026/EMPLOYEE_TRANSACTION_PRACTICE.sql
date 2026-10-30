SELECT ID , NAME , SALARY FROM EMP ORDER BY ID;
select * from DEPT;

-- Transfer funds: BEGIN, deduct from employee A’s salary, add to employee B’s salary, 
-- verify both totals balance, COMMIT. If any step fails, ROLLBACK entire transaction.

BEGIN;

UPDATE EMP SET SALARY = SALARY-5000
WHERE ID = 1 ;

UPDATE EMP SET SALARY = SALARY + 5000
WHERE ID = 2;

SELECT ID , NAME , SALARY FROM EMP 
WHERE ID IN(1,2);

COMMIT;

-- Bulk salary update with audit: BEGIN, update all Engineering salaries by 15%,
-- INSERT a row into audit_log for each updated employee (use RETURNING to get affected rows), 
-- COMMIT. Then do the same but ROLLBACK and verify nothing changed.
BEGIN;

WITH old_rows AS MATERIALIZED (
    SELECT e.ID, e.SALARY
    FROM EMP e
    JOIN DEPT d ON d.ID = e.DEPARTMENT_ID
    WHERE d.NAME = 'IT'
    FOR UPDATE OF e
),
updated AS (
    UPDATE EMP e
    SET SALARY = ROUND(old_rows.SALARY * 1.15)::INTEGER
    FROM old_rows
    WHERE e.ID = old_rows.ID
    RETURNING e.ID, e.NAME, e.SALARY AS new_salary
)
INSERT INTO AUDIT_LOG
    (EMP_ID, OLD_SALARY, NEW_SALARY, ACTION)
SELECT
    updated.ID,
    old_rows.SALARY,
    updated.new_salary,
    'SALARY_INCREASE_15_PERCENT'
FROM updated
JOIN old_rows ON old_rows.ID = updated.ID;

-- Verify the updated salaries
SELECT e.ID, e.NAME, e.SALARY
FROM EMP e
JOIN DEPT d ON d.ID = e.DEPARTMENT_ID
WHERE d.NAME = 'IT';

-- Verify the audit records
SELECT *
FROM AUDIT_LOG
WHERE ACTION = 'SALARY_INCREASE_15_PERCENT'
ORDER BY AUDIT_ID DESC;

COMMIT;

SELECT * FROM AUDIT_LOG;

-- Cascading inserts with validation: BEGIN, insert a new department, 
-- insert 3 employees into that department, insert a project, 
-- link all 3 employees to project via junction table. 
-- If any insert violates a constraint, ROLLBACK everything.

BEGIN;

DO $$
DECLARE
    new_dept_id INTEGER;
    new_project_id INTEGER;
    emp1_id INTEGER;
    emp2_id INTEGER;
    emp3_id INTEGER;
BEGIN
    -- 1. Insert a new department
    INSERT INTO DEPT (ID, NAME, BUDGET)
    VALUES (
        (SELECT COALESCE(MAX(ID), 0) + 1 FROM DEPT),
        'Innovation',
        500000
    )
    RETURNING ID INTO new_dept_id;

    -- 2. Insert three employees into the new department
    INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY, DEPARTMENT_ID, DESIGNATION)
    VALUES (
        (SELECT COALESCE(MAX(ID), 0) + 1 FROM EMP),
        'Employee One',
        'employee.one@example.com',
        25, 50000, new_dept_id, 'Developer'
    )
    RETURNING ID INTO emp1_id;

    INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY, DEPARTMENT_ID, DESIGNATION)
    VALUES (
        (SELECT COALESCE(MAX(ID), 0) + 1 FROM EMP),
        'Employee Two',
        'employee.two@example.com',
        26, 55000, new_dept_id, 'Tester'
    )
    RETURNING ID INTO emp2_id;

    INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY, DEPARTMENT_ID, DESIGNATION)
    VALUES (
        (SELECT COALESCE(MAX(ID), 0) + 1 FROM EMP),
        'Employee Three',
        'employee.three@example.com',
        27, 60000, new_dept_id, 'Team Lead'
    )
    RETURNING ID INTO emp3_id;

    -- 3. Insert a project
    INSERT INTO PROJECT (NAME, DESCRIPTION)
    VALUES ('Resource Management System', 'Internal development project')
    RETURNING ID INTO new_project_id;

    -- 4. Link all three employees to the project
    INSERT INTO EMP_PROJECT (EMP_ID, PROJECT_ID)
    VALUES
        (emp1_id, new_project_id),
        (emp2_id, new_project_id),
        (emp3_id, new_project_id);

    RAISE NOTICE 'Department ID: %, Project ID: %, Employee IDs: %, %, %',
        new_dept_id, new_project_id, emp1_id, emp2_id, emp3_id;
END $$;

COMMIT;


-- Multi-SAVEPOINT rollback: BEGIN, SAVEPOINT s1, insert employee A, SAVEPOINT s2, insert employee B 
-- (with duplicate email - fails), ROLLBACK TO s2, insert employee B with correct email, SAVEPOINT s3, 
-- insert employee C, ROLLBACK TO s1 (rolls back B and C too), verify only data before s1 exists, COMMIT.

SELECT ID , EMAIL FROM EMP ORDER BY ID;

BEGIN;

SAVEPOINT S1;

INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY)
VALUES (21, 'Employee A', 'employee.a@example.com', 25, 40000);
SAVEPOINT S2;

INSERT INTO EMP(ID,NAME,EMAIL,AGE,SALARY)
VALUES(22,'EMPLOYEE B', 'employee.a@example.com',26,45000);

ROLLBACK TO SAVEPOINT S2;

INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY)
VALUES (22, 'Employee B', 'employee.b@example.com', 26, 45000);

SAVEPOINT s3;

INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY)
VALUES (23, 'Employee C', 'employee.c@example.com', 27, 50000);

SELECT ID , EMAIL FROM EMP; -- SHOW INSERTED EMAILS

ROLLBACK TO SAVEPOINT s1;

SELECT ID , EMAIL FROM EMP; --NOT SHOWING INSERTING EMAIL EMP BECAUSE OF ROLLBACK

COMMIT;

-- Delete with safety net: BEGIN, count employees in HR department, DELETE all HR employees,
-- SELECT to verify they’re gone within the transaction, ROLLBACK, SELECT again to verify they’re back.

SELECT  E.ID , E.NAME , D.NAME FROM EMP E LEFT JOIN DEPT D ON D.ID = E.DEPARTMENT_ID WHERE D.NAME = 'HR';

BEGIN;
DELETE FROM EMP WHERE DEPARTMENT_ID IN (SELECT ID FROM DEPT WHERE NAME = 'HR');

SELECT  E.ID , E.NAME , D.NAME FROM EMP E LEFT JOIN DEPT D ON D.ID = E.DEPARTMENT_ID WHERE D.NAME = 'HR'; --DELETED ALL HR

ROLLBACK;

SELECT  E.ID , E.NAME , D.NAME FROM EMP E LEFT JOIN DEPT D ON D.ID = E.DEPARTMENT_ID WHERE D.NAME = 'HR'; -- ROLLBACK TO PREV TABLE
