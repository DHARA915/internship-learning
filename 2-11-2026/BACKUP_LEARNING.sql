SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE' 
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

SELECT * FROM DEPARTMENTS;

DROP TABLE DEPARTMENTS;

-- RUN COMMAND IN CMD .

-- CREATING BACKUP FOLDER...................
-- mkdir C:\PostgresBackup

-- CREATE DATABSE BACKUP USING PG_DUMP.................
-- pg_dump -U postgres -d practice_db -f "C:\PostgresBackup\backup.sql"

-- DROP TABLE...........
DROP TABLE DEPARTMENTS;
SELECT * FROM DEPARTMENTS; --NOT FOUND 

-- RESTORE THE BACKUP USING PLSQL
-- psql -U postgres -d practice_db -f "C:\PostgresBackup\backup.sql"
