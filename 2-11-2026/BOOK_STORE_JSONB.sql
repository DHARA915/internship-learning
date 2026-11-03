-- METADATA JSONB IN BOOKS;

SELECT * FROM BOOKS ORDER BY ID;
SELECT * FROM AUTHORS ORDER BY ID;

-- QUESTION 1 : Add a metadata JSONB column to books. Insert data: 
-- {"pages": 350, "language": "en", "edition": 2, "tags": ["fiction", "bestseller"]}

ALTER TABLE BOOKS
ADD COLUMN METADATA JSONB;

-- ADD MORE BOOKS

INSERT INTO BOOKS
(
    ID,
    TITLE,
    ISBN,
    PRICE,
    STOCK_QUANTITY,
    AUTHOR_ID,
    CATEGORY_ID,
    METADATA
)
OVERRIDING SYSTEM VALUE
VALUES

(
    11,
    'The Silent Patient',
    '9781250301697',
    450.00,
    20,
    1,
    1,
    '{
        "pages": 336,
        "language": "en",
        "edition": 1,
        "genre": "psychological thriller",
        "tags": ["fiction", "thriller", "bestseller"],
        "rating": 4.5,
        "publication_year": 2019,
        "is_bestseller": true
    }'::JSONB
),

(
    12,
    'Atomic Habits',
    '9780735211292',
    550.00,
    15,
    2,
    2,
    '{
        "pages": 320,
        "language": "en",
        "edition": 2,
        "genre": "self-help",
        "tags": ["non-fiction", "productivity", "bestseller"],
        "rating": 4.8,
        "publication_year": 2018,
        "is_bestseller": true
    }'::JSONB
),

(
    13,
    'The Alchemist',
    '9780061122415',
    350.00,
    30,
    1,
    2,
    '{
        "pages": 208,
        "language": "en",
        "edition": 3,
        "genre": "adventure fiction",
        "tags": ["fiction", "adventure", "classic"],
        "rating": 4.2,
        "publication_year": 1988,
        "is_bestseller": false
    }'::JSONB
),

(
    14,
    'Rich Dad Poor Dad',
    '9781612680194',
    399.00,
    12,
    2,
    1,
    '{
        "pages": 336,
        "language": "en",
        "edition": 2,
        "genre": "personal finance",
        "tags": ["non-fiction", "finance", "investment"],
        "rating": 4.3,
        "publication_year": 1997,
        "is_bestseller": true
    }'::JSONB
),

(
    15,
    'Wings of Fire',
    '9788173711466',
    299.00,
    25,
    1,
    1,
    '{
        "pages": 180,
        "language": "hi",
        "edition": 1,
        "genre": "autobiography",
        "tags": ["biography", "inspiration", "non-fiction"],
        "rating": 4.7,
        "publication_year": 1999,
        "is_bestseller": false
    }'::JSONB
);

-- UPDATE EXISTING BOOK
UPDATE books
SET metadata = '{
    "pages": 350,
    "language": "en",
    "edition": 2,
    "tags": ["fiction", "bestseller"]
}'::JSONB
WHERE id = 2;

SELECT * FROM BOOKS ORDER BY ID;

-- QUESTION : 2 Query books where metadata->>'language' = 'en'
SELECT * FROM BOOKS WHERE metadata ->>'language' = 'en' ORDER BY ID;

-- QUESTION : 3 Query books where metadata contains a specific tag: metadata @> '{"tags": ["fiction"]}'
SELECT * FROM BOOKS WHERE metadata @> '{"tags" : ["fiction"]}'

-- QUESTION : 4 Update JSONB: use jsonb_set to change edition to 3 for a specific book

UPDATE BOOKS SET METADATA = jsonb_set(
METADATA,
'{edition}',
'3'::JSONB
)
WHERE ID = 2;

-- QUESTION : 5 Create a GIN index on books(metadata), run 
-- EXPLAIN ANALYZE on a JSONB query to verify index usage

CREATE INDEX idx_books_metadata ON BOOKS USING GIN(METADATA);

-- TEST 
SET enable_seqscan = OFF;

EXPLAIN ANALYZE
SELECT * FROM BOOKS WHERE metadata @> '{"tags" : ["fiction"]}'::JSONB;

-- RESET enable_seqscan;

-- QUESTION : 6 Add a tags text[] column to products/books.
-- Insert array values like ARRAY['electronics', 'sale', 'featured']

-- ADD TEXT[] COLUMN

ALTER TABLE BOOKS ADD COLUMN TAGS TEXT[];

ALTER TABLE BOOKS DROP TAGS;

-- Insert array values into existing books
UPDATE BOOKS
SET TAGS = ARRAY['fiction', 'sale', 'bestseller']
WHERE ID = 2;

-- QUESTION : 7 Query where 'sale' = ANY(tags) 
SELECT * FROM BOOKS WHERE 'sale' = ANY(TAGS);

-- QUESTION : 8 Use unnest(tags) to explode tags into individual 
-- rows, count how many items have each tag

-- CREATING INDIVIDUAL TAG ROWS

SELECT ID , TITLE , UNNEST(TAGS) AS TAG FROM BOOKS;
-- CROSS JOIN TO FIND COUNT 

SELECT T.TAG , COUNT(*) AS TOTAL_BOOKS
FROM BOOKS B
CROSS JOIN LATERAL UNNEST (B.TAGS) AS T(TAG) GROUP BY T.TAG ORDER BY TOTAL_BOOKS DESC;

-- QUESTION : 11 Full-text search: Add a search_vector tsvector column to books.
-- Populate with to_tsvector('english', title || ' ' || coalesce(description, '')).
-- Create GIN index. Search using to_tsquery('english', 'database & design').

-- ADD SAMPLE DESCRIPTION TO TEST THE SEARCH.

SELECT * FROM BOOKS ORDER BY ID;

ALTER TABLE BOOKS ADD COLUMN IF NOT EXISTS DESCRIPTION TEXT;

UPDATE BOOKS SET DESCRIPTION = 'A practical guide to database design and PostgreSQL concepts.' WHERE ID = 2;
UPDATE BOOKS SET DESCRIPTION = 'Learn programming and software development techniques.' WHERE ID = 3;
UPDATE BOOKS SET DESCRIPTION = 'Introduction to database architecture and system design.' WHERE ID = 4 RETURNING *;

-- TSVECTOR is a PostgreSQL data type that stores processed text in a 
-- format optimized for full-text searching.

-- ADD SEARCH VERCTOR COLUMN
ALTER TABLE BOOKS ADD COLUMN SEARCH_VECTOR TSVECTOR;

UPDATE BOOKS SET SEARCH_VECTOR = TO_TSVECTOR(
'english',
TITLE || ' ' || COALESCE(DESCRIPTION , '')
);

-- CREATE GIN INDEX


CREATE INDEX idx_books_search ON BOOKS USING GIN(SEARCH_VECTOR);

-- SEARCH QUERY USING TO_TSQUERY.
SELECT ID , TITLE , DESCRIPTION , SEARCH_VECTOR FROM BOOKS 
WHERE SEARCH_VECTOR @@ TO_TSQUERY('english', 'database & design');

SELECT ID , TITLE , DESCRIPTION , SEARCH_VECTOR FROM BOOKS 
WHERE SEARCH_VECTOR @@ TO_TSQUERY('english' , 'database | design');

SELECT ID , TITLE , DESCRIPTION , SEARCH_VECTOR FROM BOOKS
WHERE SEARCH_VECTOR @@ TO_TSQUERY('english' , 'database & !design')

-- QUESTION : 12 Run EXPLAIN ANALYZE on your heaviest query from the bookstore task. 
-- Note cost and execution time. Add an appropriate index. Run again and compare.

-- RUN BEFORE INDEXING.
EXPLAIN ANALYZE
SELECT *
FROM BOOKS
WHERE CATEGORY_ID = 1
ORDER BY PRICE DESC;

CREATE INDEX idx_books_category_price
ON BOOKS (CATEGORY_ID , PRICE DESC);

-- DROP INDEX
DROP INDEX idx_books_category_price;

-- UPDATE TABLE STATISTICS : This helps PostgreSQL's query planner make an informed decision.
ANALYZE BOOKS;
-- RUN THE SAME QUERY : --OPTIMIZE TIME AND COST BY INDEXING
EXPLAIN ANALYZE
SELECT *
FROM BOOKS
WHERE CATEGORY_ID = 1
ORDER BY PRICE DESC;

-- QUESTION : 13  Run VACUUM ANALYZE on a table. Check pg_stat_user_tables 
-- for last_vacuum and last_analyze timestamps.

-- VACUUM: Removes dead row versions left behind by UPDATE and DELETE operations, making space reusable.
-- ANALYZE: Collects statistics about table data for the query planner.
-- VACUUM ANALYZE: Performs both operations.

VACUUM ANALYZE BOOKS;

-- NOTE: VACUUM CANNOT RUN INSIDE AN EXPLICIT TRANSACTION BLOCK.

-- CHECK LAST VACUUM AND ANALYZE TIMESTAMPS.

SELECT
    RELNAME,
    LAST_VACUUM,
    LAST_AUTOVACUUM,
    LAST_ANALYZE,
    LAST_AUTOANALYZE
FROM PG_STAT_USER_TABLES
WHERE RELNAME = 'books';

-- QUESTION : 14 Demonstrate OFFSET pagination: SELECT * FROM books ORDER BY id LIMIT 10 OFFSET 20. 
-- Then do cursor-based: SELECT * FROM books WHERE id > 30 ORDER BY id LIMIT 10. Explain why cursor-based
-- is better for large datasets.

-- OFFSET PAGINATION

SELECT * FROM BOOKS ORDER BY ID LIMIT 5 OFFSET 5;

-- CURSOR-BASED PAGINATION
SELECT * FROM BOOKS WHERE ID>5 LIMIT 5;

--  WHY=> Cursor pagination is generally better for large datasets because it avoids repeatedly skipping large numbers of rows.