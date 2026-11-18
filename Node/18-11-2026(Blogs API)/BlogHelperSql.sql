SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;



-- USERS TABLE
SELECT * FROM USERS;
SELECT * FROM pgmigrations;
SELECT * FROM POSTS;
SELECT * FROM CATEGORIES;
SELECT * FROM COMMENTS;



SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'posts'
AND tc.constraint_type = 'FOREIGN KEY';

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'refresh_tokens'
ORDER BY ordinal_position;
