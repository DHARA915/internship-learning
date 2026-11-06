-- QUERIES

-- SELECT TABLES -------------------------------------------------------------------------------------------------------------------------------------------------------

SELECT * FROM WORKSPACES;
SELECT * FROM USERS;
SELECT * FROM PROJECTS;
SELECT * FROM BOARDS;
SELECT * FROM BOARD_COLUMNS;
SELECT * FROM TASKS ORDER BY ID;
SELECT * FROM TASK_COMMENTS;
SELECT * FROM LABELS;
SELECT * FROM TASK_LABELS;
SELECT * FROM TASK_HISTORY ORDER BY ID DESC;

-- Q:1 Create trigger: on task UPDATE, if status changed, auto-insert into task_history
-- (task_id, old_status, new_status, changed_at, changed_by)

-- SESSION VARIABLE 
SET app.current_user_id = '2';

-- CREATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    old_status VARCHAR(100);
    new_status VARCHAR(100);
    current_user_id BIGINT;
BEGIN
    SELECT NAME
    INTO old_status
    FROM BOARD_COLUMNS
    WHERE ID = OLD.BOARD_COLUMN_ID;

    SELECT NAME
    INTO new_status
    FROM BOARD_COLUMNS
    WHERE ID = NEW.BOARD_COLUMN_ID;

    IF OLD.BOARD_COLUMN_ID IS DISTINCT FROM NEW.BOARD_COLUMN_ID THEN

        current_user_id :=
            NULLIF(
                current_setting('app.current_user_id', TRUE),
                ''
            )::BIGINT;

        IF current_user_id IS NULL THEN
            RAISE EXCEPTION 'Current user ID is not set';
        END IF;

        INSERT INTO TASK_HISTORY (
            TASK_ID,
            OLD_STATUS,
            NEW_STATUS,
            CHANGED_AT,
            CHANGED_BY
        )
        VALUES (
            NEW.ID,
            old_status,
            new_status,
            CURRENT_TIMESTAMP,
            current_user_id
        );

    END IF;

    RETURN NEW;
END;
$$;

-- CREATE TRIGGER
CREATE TRIGGER trg_task_status_change
AFTER UPDATE OF BOARD_COLUMN_ID 
ON TASKS
FOR EACH ROW
EXECUTE FUNCTION log_task_status_change();

-- TEST TRIGGER
UPDATE TASKS SET BOARD_COLUMN_ID = 2 WHERE ID=1;

-- VERIFY
SELECT
    H.TASK_ID,
    T.TITLE,
    H.OLD_STATUS,
    H.NEW_STATUS,
    H.CHANGED_AT,
    U.NAME AS CHANGED_BY
FROM TASK_HISTORY H
JOIN TASKS T
    ON T.ID = H.TASK_ID
JOIN USERS U
    ON U.ID = H.CHANGED_BY
WHERE H.TASK_ID = 1
ORDER BY H.CHANGED_AT DESC;

------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Q:2 Find overdue tasks (due_date < NOW() AND status != 'done') with assignee name and days overdue

SELECT T.ID AS TASK_ID , 
T.TITLE ,
U.NAME AS ASSIGNEE_NAME ,
T.DUE_DATE ,
B.NAME AS STATUS ,
CURRENT_DATE - T.DUE_DATE AS DAYS_OVERDUE
FROM TASKS T 
INNER JOIN BOARD_COLUMNS B 
      ON T.BOARD_COLUMN_ID = B.ID
LEFT JOIN USERS U
      ON U.ID = T.ASSIGNEE_ID
WHERE T.DUE_DATE < CURRENT_DATE
      AND LOWER(B.NAME)<>'done'
ORDER BY T.DUE_DATE ASC;

------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Q:3 Window: Rank tasks by time spent (actual_hours) within each project.

SELECT
    P.NAME AS PROJECT_NAME,
    T.ID AS TASK_ID,
    T.TITLE,
    T.ACTUAL_HOURS,

    RANK() OVER (
        PARTITION BY P.ID
        ORDER BY T.ACTUAL_HOURS DESC
    ) AS TASK_RANK

FROM TASKS T
JOIN BOARD_COLUMNS BC
    ON BC.ID = T.BOARD_COLUMN_ID
JOIN BOARDS B
    ON B.ID = BC.BOARD_ID
JOIN PROJECTS P
    ON P.ID = B.PROJECT_ID

ORDER BY P.ID, TASK_RANK;

------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Q:4 CTE: Show project health - per project: total tasks, completed %, overdue count, avg completion time

WITH PROJECT_STATUS AS (
     SELECT 
	   P.ID AS PROJECT_ID , 
	   P.NAME AS PROJECT_NAME,
	   COUNT(T.ID) AS TOTAL_TASKS,

	   COUNT(T.ID) FILTER(
         WHERE BC.NAME = 'Done'
	   ) AS COMPLETED_TASKS,

	   COUNT(T.ID) FILTER (
            WHERE T.DUE_DATE < CURRENT_DATE
              AND BC.NAME <> 'Done'
        ) AS OVERDUE_TASKS
		
FROM PROJECTS P
INNER JOIN  BOARDS B
      ON B.PROJECT_ID = P.ID
INNER JOIN BOARD_COLUMNS BC
      ON BC.BOARD_ID = B.ID
LEFT JOIN TASKS T
      ON T.BOARD_COLUMN_ID = BC.ID

GROUP BY P.ID , P.NAME 
),

COMPLETION_STATS AS (
    SELECT
        P.ID AS PROJECT_ID,
		P.NAME AS PROJECT_NAME,

        AVG(
            EXTRACT(
                EPOCH FROM (H.CHANGED_AT - T.CREATED_AT)
            ) / 86400
        ) AS AVG_COMPLETION_DAYS

    FROM PROJECTS P
    JOIN BOARDS B
        ON B.PROJECT_ID = P.ID
    JOIN BOARD_COLUMNS BC
        ON BC.BOARD_ID = B.ID
    JOIN TASKS T
        ON T.BOARD_COLUMN_ID = BC.ID
    JOIN TASK_HISTORY H
        ON H.TASK_ID = T.ID

    WHERE H.NEW_STATUS = 'Done'

    GROUP BY P.ID,P.NAME
)

-- FINAL QUERY
SELECT
    PS.PROJECT_ID,
    PS.PROJECT_NAME,
    PS.TOTAL_TASKS,
    PS.COMPLETED_TASKS,

    ROUND(
        PS.COMPLETED_TASKS * 100.0 /
        NULLIF(PS.TOTAL_TASKS, 0),
        2
    ) AS COMPLETED_PERCENTAGE,

    PS.OVERDUE_TASKS,

    ROUND(
        CS.AVG_COMPLETION_DAYS::NUMERIC,
        2
    ) AS AVG_COMPLETION_DAYS

FROM PROJECT_STATUS PS
LEFT JOIN COMPLETION_STATS CS
    ON CS.PROJECT_ID = PS.PROJECT_ID

ORDER BY PS.PROJECT_ID;

------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Q:5 Find users who have more than 5 open tasks assigned (potential bottleneck).

SELECT
    U.ID AS USER_ID,
    U.NAME AS USER_NAME,
    COUNT(T.ID) AS OPEN_TASKS
FROM USERS U
INNER JOIN TASKS T
    ON T.ASSIGNEE_ID = U.ID
INNER JOIN BOARD_COLUMNS BC
    ON BC.ID = T.BOARD_COLUMN_ID
WHERE LOWER(BC.NAME) <> 'done'
GROUP BY U.ID, U.NAME
HAVING COUNT(T.ID) > 5
ORDER BY OPEN_TASKS DESC;

------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Q:6 Show task movement history: task title, each status change with timestamp and who changed it

	SELECT 
	TH.ID AS TASK_ID ,
	T.TITLE AS TASK_NAME,
	TH.OLD_STATUS ,
	TH.NEW_STATUS ,
	TH.CHANGED_AT,
	TH.CHANGED_BY AS CHANGED_USER_ID ,
	U.NAME AS CHANGE_USER_NAME
	
	FROM TASK_HISTORY TH
	LEFT JOIN USERS U
	     ON TH.CHANGED_BY = U.ID
	INNER JOIN TASKS T
	     ON TH.TASK_ID =T.ID;

------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Q:7 LAG: For each task, calculate time spent in each status (difference between consecutive status changes)
SELECT
    T.ID AS TASK_ID,
    T.TITLE AS TASK_NAME,
    TH.OLD_STATUS,
    TH.NEW_STATUS,
    TH.CHANGED_AT,

    LAG(TH.CHANGED_AT) OVER (
        PARTITION BY TH.TASK_ID
        ORDER BY TH.CHANGED_AT
    ) AS PREVIOUS_CHANGE,

    ROUND(
        (
            EXTRACT(
                EPOCH FROM (
                    TH.CHANGED_AT -
                    LAG(TH.CHANGED_AT) OVER (
                        PARTITION BY TH.TASK_ID
                        ORDER BY TH.CHANGED_AT
                    )
                )
            ) / 3600
        )::NUMERIC,
        2
    ) AS HOURS_SPENT

FROM TASK_HISTORY TH
INNER JOIN TASKS T
    ON T.ID = TH.TASK_ID

ORDER BY T.ID, TH.CHANGED_AT;

------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Q:8 Create function: get_sprint_report(project_id, start_date, end_date) RETURNS TABLE - tasks completed,
-- tasks added, carryover tasks, velocity (points or count per day)

CREATE OR REPLACE FUNCTION get_sprint_report(
    p_project_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    tasks_completed BIGINT,
    tasks_added BIGINT,
    carryover_tasks BIGINT,
    velocity NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF p_start_date > p_end_date THEN
        RAISE EXCEPTION 'Start date cannot be greater than end date';
    END IF;

    RETURN QUERY

    WITH PROJECT_TASKS AS (
        SELECT
            T.ID,
            T.CREATED_AT
        FROM TASKS T
        JOIN BOARD_COLUMNS BC
            ON BC.ID = T.BOARD_COLUMN_ID
        JOIN BOARDS B
            ON B.ID = BC.BOARD_ID
        WHERE B.PROJECT_ID = p_project_id
    ),

    COMPLETED_TASKS AS (
        SELECT DISTINCT ON (H.TASK_ID)
            H.TASK_ID,
            H.CHANGED_AT
        FROM TASK_HISTORY H
        JOIN PROJECT_TASKS PT
            ON PT.ID = H.TASK_ID
        WHERE H.NEW_STATUS = 'Done'
          AND H.CHANGED_AT < p_end_date + INTERVAL '1 day'
        ORDER BY H.TASK_ID, H.CHANGED_AT DESC
    )

    SELECT
        COUNT(*) FILTER (
            WHERE CT.CHANGED_AT >= p_start_date
              AND CT.CHANGED_AT < p_end_date + INTERVAL '1 day'
        ),

        COUNT(*) FILTER (
            WHERE PT.CREATED_AT >= p_start_date
              AND PT.CREATED_AT < p_end_date + INTERVAL '1 day'
        ),

        COUNT(*) FILTER (
            WHERE PT.CREATED_AT < p_end_date + INTERVAL '1 day'
              AND (
                  CT.CHANGED_AT IS NULL
                  OR CT.CHANGED_AT >= p_end_date + INTERVAL '1 day'
              )
        ),

        ROUND(
            (
                COUNT(*) FILTER (
                    WHERE CT.CHANGED_AT >= p_start_date
                      AND CT.CHANGED_AT < p_end_date + INTERVAL '1 day'
                )::NUMERIC
            ) /
            NULLIF(p_end_date - p_start_date + 1, 0),
            2
        )

    FROM PROJECT_TASKS PT
    LEFT JOIN COMPLETED_TASKS CT
        ON CT.TASK_ID = PT.ID;

END;
$$;


------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Q:9 Create function: get_sprint_report(project_id, start_date, end_date) RETURNS TABLE - tasks completed,
-- tasks added, carryover tasks, velocity (points or count per day)

CREATE OR REPLACE FUNCTION get_sprint_report(
    p_project_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    tasks_completed BIGINT,
    tasks_added BIGINT,
    carryover_tasks BIGINT,
    velocity NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF p_start_date > p_end_date THEN
        RAISE EXCEPTION 'Start date cannot be greater than end date';
    END IF;

    RETURN QUERY

    WITH PROJECT_TASKS AS (
        SELECT
            T.ID,
            T.CREATED_AT
        FROM TASKS T
        JOIN BOARD_COLUMNS BC
            ON BC.ID = T.BOARD_COLUMN_ID
        JOIN BOARDS B
            ON B.ID = BC.BOARD_ID
        WHERE B.PROJECT_ID = p_project_id
    ),

    COMPLETED_TASKS AS (
        SELECT DISTINCT ON (H.TASK_ID)
            H.TASK_ID,
            H.CHANGED_AT
        FROM TASK_HISTORY H
        JOIN PROJECT_TASKS PT
            ON PT.ID = H.TASK_ID
        WHERE H.NEW_STATUS = 'Done'
          AND H.CHANGED_AT < p_end_date + INTERVAL '1 day'
        ORDER BY H.TASK_ID, H.CHANGED_AT DESC
    )

    SELECT
        COUNT(*) FILTER (
            WHERE CT.CHANGED_AT >= p_start_date
              AND CT.CHANGED_AT < p_end_date + INTERVAL '1 day'
        ),

        COUNT(*) FILTER (
            WHERE PT.CREATED_AT >= p_start_date
              AND PT.CREATED_AT < p_end_date + INTERVAL '1 day'
        ),

        COUNT(*) FILTER (
            WHERE PT.CREATED_AT < p_end_date + INTERVAL '1 day'
              AND (
                  CT.CHANGED_AT IS NULL
                  OR CT.CHANGED_AT >= p_end_date + INTERVAL '1 day'
              )
        ),

        ROUND(
            (
                COUNT(*) FILTER (
                    WHERE CT.CHANGED_AT >= p_start_date
                      AND CT.CHANGED_AT < p_end_date + INTERVAL '1 day'
                )::NUMERIC
            ) /
            NULLIF(p_end_date - p_start_date + 1, 0),
            2
        )

    FROM PROJECT_TASKS PT
    LEFT JOIN COMPLETED_TASKS CT
        ON CT.TASK_ID = PT.ID;

END;
$$;

-- Q:10 Materialized view: team_workload - member name, open tasks, overdue tasks, hours logged this week, completion rate.

CREATE MATERIALIZED VIEW TEAM_WORKLOAD AS

SELECT
    U.ID AS USER_ID,
    U.NAME AS MEMBER_NAME,

    COUNT(T.ID) FILTER (
        WHERE BC.NAME <> 'Done'
    ) AS OPEN_TASKS,

    COUNT(T.ID) FILTER (
        WHERE BC.NAME <> 'Done'
          AND T.DUE_DATE < CURRENT_DATE
    ) AS OVERDUE_TASKS,

    COALESCE(
        SUM(T.ACTUAL_HOURS) FILTER (
            WHERE T.UPDATED_AT >= DATE_TRUNC('week', CURRENT_DATE)
        ),
        0
    ) AS HOURS_LOGGED_THIS_WEEK,

    ROUND(
        COUNT(T.ID) FILTER (
            WHERE BC.NAME = 'Done'
        ) * 100.0 /
        NULLIF(COUNT(T.ID), 0),
        2
    ) AS COMPLETION_RATE

FROM USERS U

LEFT JOIN TASKS T
    ON T.ASSIGNEE_ID = U.ID

LEFT JOIN BOARD_COLUMNS BC
    ON BC.ID = T.BOARD_COLUMN_ID

GROUP BY U.ID, U.NAME;

-- DISPLAY 
SELECT *
FROM TEAM_WORKLOAD
ORDER BY OPEN_TASKS DESC;

-- REFRESH
REFRESH MATERIALIZED VIEW TEAM_WORKLOAD;

-- Q:11  Full dashboard query: workspace summary with project count, active tasks, team size, upcoming deadlines (next 7 days), recently completed (last 7 days) - single query using CTEs.
WITH WORKSPACE_PROJECTS AS (
    SELECT
        W.ID AS WORKSPACE_ID,
        W.NAME AS WORKSPACE_NAME,
        P.ID AS PROJECT_ID
    FROM WORKSPACES W
    LEFT JOIN PROJECTS P
        ON P.WORKSPACE_ID = W.ID
),

PROJECT_SUMMARY AS (
    SELECT
        WORKSPACE_ID,
        COUNT(PROJECT_ID) AS PROJECT_COUNT
    FROM WORKSPACE_PROJECTS
    GROUP BY WORKSPACE_ID
),

TASK_SUMMARY AS (
    SELECT
        WP.WORKSPACE_ID,

        COUNT(T.ID) FILTER (
            WHERE BC.NAME <> 'Done'
        ) AS ACTIVE_TASKS,

        COUNT(T.ID) FILTER (
            WHERE T.DUE_DATE BETWEEN CURRENT_DATE
                                 AND CURRENT_DATE + 7
              AND BC.NAME <> 'Done'
        ) AS UPCOMING_DEADLINES

    FROM WORKSPACE_PROJECTS WP
    JOIN BOARDS B
        ON B.PROJECT_ID = WP.PROJECT_ID
    JOIN BOARD_COLUMNS BC
        ON BC.BOARD_ID = B.ID
    LEFT JOIN TASKS T
        ON T.BOARD_COLUMN_ID = BC.ID

    GROUP BY WP.WORKSPACE_ID
),

TEAM_SUMMARY AS (
    SELECT
        WP.WORKSPACE_ID,
        COUNT(DISTINCT T.ASSIGNEE_ID) AS TEAM_SIZE

    FROM WORKSPACE_PROJECTS WP
    JOIN BOARDS B
        ON B.PROJECT_ID = WP.PROJECT_ID
    JOIN BOARD_COLUMNS BC
        ON BC.BOARD_ID = B.ID
    JOIN TASKS T
        ON T.BOARD_COLUMN_ID = BC.ID

    GROUP BY WP.WORKSPACE_ID
),

COMPLETED_SUMMARY AS (
    SELECT
        WP.WORKSPACE_ID,
        COUNT(DISTINCT T.ID) AS RECENTLY_COMPLETED

    FROM WORKSPACE_PROJECTS WP
    JOIN BOARDS B
        ON B.PROJECT_ID = WP.PROJECT_ID
    JOIN BOARD_COLUMNS BC
        ON BC.BOARD_ID = B.ID
    JOIN TASKS T
        ON T.BOARD_COLUMN_ID = BC.ID
    JOIN TASK_HISTORY H
        ON H.TASK_ID = T.ID

    WHERE H.NEW_STATUS = 'Done'
      AND H.CHANGED_AT >= CURRENT_TIMESTAMP - INTERVAL '7 days'
      AND H.CHANGED_AT <= CURRENT_TIMESTAMP

    GROUP BY WP.WORKSPACE_ID
)

SELECT
    W.ID AS WORKSPACE_ID,
    W.NAME AS WORKSPACE_NAME,

    COALESCE(PS.PROJECT_COUNT, 0) AS PROJECT_COUNT,

    COALESCE(TS.ACTIVE_TASKS, 0) AS ACTIVE_TASKS,

    COALESCE(TE.TEAM_SIZE, 0) AS TEAM_SIZE,

    COALESCE(TS.UPCOMING_DEADLINES, 0) AS UPCOMING_DEADLINES,

    COALESCE(CS.RECENTLY_COMPLETED, 0) AS RECENTLY_COMPLETED

FROM WORKSPACES W

LEFT JOIN PROJECT_SUMMARY PS
    ON PS.WORKSPACE_ID = W.ID

LEFT JOIN TASK_SUMMARY TS
    ON TS.WORKSPACE_ID = W.ID

LEFT JOIN TEAM_SUMMARY TE
    ON TE.WORKSPACE_ID = W.ID

LEFT JOIN COMPLETED_SUMMARY CS
    ON CS.WORKSPACE_ID = W.ID

ORDER BY W.ID;

