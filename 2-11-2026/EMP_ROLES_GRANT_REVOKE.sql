-- TASK : 30/11/2026

SELECT * FROM EMP ORDER BY ID;
SELECT * FROM DEPT ORDER BY ID;

-- ONLY GRANT FOR SELECT-----------------------------------------------------------------------------------------------------------------------------------
-- ERROR:  permission denied for table emp for INSERT , UPDATE 
UPDATE EMP SET AGE = 22 WHERE ID=1 RETURNING *;

INSERT INTO DEPT(ID, NAME,BUDGET) VALUES (8,'CULTURAL',350000);

DELETE FROM EMP WHERE ID = 1;

-- AFTER UPDATING GRANT WITH UPDATE (SO, SELECT & UPDATE)
UPDATE EMP SET AGE = 22 WHERE ID=1 RETURNING *;

-- AFTER REVOKING GRANT UPDATE
-- ERROR:  permission denied for table emp 
UPDATE EMP SET AGE = 23 WHERE ID=1 RETURNING *;





