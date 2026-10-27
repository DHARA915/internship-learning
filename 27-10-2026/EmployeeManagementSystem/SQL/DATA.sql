SELECT tablename 
FROM pg_catalog.pg_tables 
WHERE schemaname = 'public';

SELECT * FROM DEPT;
SELECT * FROM EMP;
SELECT * FROM ATTENDANCE;
SELECT * FROM LEAVE_TYPES;
SELECT * FROM LEAVE_REQUESTS;
SELECT * FROM LEAVE_BALANCES;
SELECT * FROM SALARY_RECORDS;

-------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO DEPT (ID, NAME, BUDGET) VALUES
(1, 'IT',        500000),
(2, 'SALES',     400000),
(3, 'HR',        300000),
(4, 'FINANCE',   450000),
(5, 'MARKETING', 350000),
(6, 'AUDIT',      40000);

---------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO EMP (ID, NAME, EMAIL, AGE, SALARY, DEPARTMENT_ID, MANAGER_ID, IS_ACTIVE, JOINING_DATE, DESIGNATION) VALUES
(1,  'Dhara Patel',    'dhara.patel@company.com',    32, 120000, 1,    NULL, TRUE,  '2019-04-01', 'IT Manager'),
(2,  'Rahul Sharma',   'rahul.sharma@company.com',   35, 110000, 2,    NULL, TRUE,  '2018-07-15', 'Sales Manager'),
(3,  'Priya Mehta',    'priya.mehta@company.com',    33,  95000, 3,    NULL, TRUE,  '2020-01-20', 'HR Manager'),
(4,  'Amit Shah',      'amit.shah@company.com',      40, 125000, 4,    NULL, TRUE,  '2017-03-10', 'Finance Manager'),
(5,  'Neha Desai',     'neha.desai@company.com',     34, 100000, 5,    NULL, TRUE,  '2019-09-05', 'Marketing Manager'),
(6,  'Karan Joshi',    'karan.joshi@company.com',    27,  65000, 1,    1,    TRUE,  '2022-06-01', 'Software Developer'),
(7,  'Riya Gupta',     'riya.gupta@company.com',     26,  60000, 1,    1,    TRUE,  '2023-02-13', 'Software Developer'),
(8,  'Arjun Nair',     'arjun.nair@company.com',     29,  55000, 2,    2,    TRUE,  '2022-11-21', 'Sales Executive'),
(9,  'Meera Iyer',     'meera.iyer@company.com',     25,  48000, 2,    2,    TRUE,  '2024-01-08', 'Sales Executive'),
(10, 'Vikram Singh',   'vikram.singh@company.com',   31,  58000, 4,    4,    TRUE,  '2021-08-16', 'Accountant'),
(11, 'Anjali Verma',   'anjali.verma@company.com',   28,  45000, 3,    3,    TRUE,  '2023-05-29', 'HR Executive'),
(12, 'Rohit Kumar',    'rohit.kumar@company.com',    30,  52000, 5,    5,    TRUE,  '2022-09-12', 'Marketing Executive'),
(13, 'Sneha Reddy',    'sneha.reddy@company.com',    24,  35000, 1,    1,    TRUE,  '2025-06-02', 'Intern'),
(14, 'Manish Trivedi', 'manish.trivedi@company.com', 38,  70000, NULL, NULL, TRUE,  '2021-02-01', 'Consultant'),
(15, 'Pooja Rana',     'pooja.rana@company.com',     45,  80000, 4,    4,    FALSE, '2016-12-01', 'Senior Accountant');

----------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO LEAVE_TYPES (TYPE_NAME, MAX_DAYS_YEAR, IS_PAID) VALUES
('Casual Leave',     12, TRUE),    -- short personal needs
('Sick Leave',       10, TRUE),    -- illness / medical
('Earned Leave',     15, TRUE),    -- planned vacation (privilege leave)
('Unpaid Leave',     30, FALSE),   -- leave without pay
('Maternity Leave', 182, TRUE);    -- 26 weeks
-------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO LEAVE_REQUESTS
    (EMP_ID, LEAVE_TYPE_ID, START_DATE, END_DATE, REASON, STATUS, APPLIED_ON, APPROVED_BY, DECISION_ON)
VALUES
-- approved
(3,  1, '2026-10-22', '2026-10-23', 'Family function',   'APPROVED',  '2026-10-15 10:00:00', 2,    '2026-10-15 15:30:00'),
(11, 2, '2026-10-21', '2026-10-21', 'Fever',             'APPROVED',  '2026-10-21 08:30:00', 3,    '2026-10-21 09:15:00'),
(8,  2, '2026-10-21', '2026-10-21', 'Stomach infection', 'APPROVED',  '2026-10-21 08:45:00', 2,    '2026-10-21 09:30:00'),
(12, 1, '2026-09-14', '2026-09-15', 'Personal work',     'APPROVED',  '2026-09-10 11:00:00', 5,    '2026-09-10 16:00:00'),
(7,  3, '2026-08-10', '2026-08-14', 'Family trip',       'APPROVED',  '2026-07-20 09:00:00', 1,    '2026-07-21 10:00:00'),
(13, 2, '2026-09-01', '2026-09-02', 'Viral infection',   'APPROVED',  '2026-09-01 09:00:00', 1,    '2026-09-01 11:00:00'),
(4,  2, '2026-07-14', '2026-07-16', 'Surgery recovery',  'APPROVED',  '2026-07-10 10:00:00', 2,    '2026-07-10 12:00:00'),
-- pending (no approver yet)
(6,  3, '2026-11-02', '2026-11-06', 'Vacation',          'PENDING',   '2026-10-20 14:00:00', NULL, NULL),
(9,  1, '2026-11-10', '2026-11-11', 'Cousin wedding',    'PENDING',   '2026-10-26 10:30:00', NULL, NULL),
(5,  3, '2026-12-24', '2026-12-31', 'Year-end holidays', 'PENDING',   '2026-10-25 17:00:00', NULL, NULL),
-- rejected
(10, 1, '2026-10-05', '2026-10-06', 'Personal',          'REJECTED',  '2026-10-01 10:00:00', 4,    '2026-10-02 09:00:00'),
-- cancelled
(1,  1, '2026-10-30', '2026-10-30', 'Plans changed',     'CANCELLED', '2026-10-22 12:00:00', NULL, NULL);

-------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO LEAVE_BALANCES (EMP_ID, LEAVE_TYPE_ID, YEAR, ALLOCATED_DAYS, USED_DAYS) VALUES
(1,  1, 2026, 12, 3),  (1,  2, 2026, 10, 2),  (1,  3, 2026, 18, 6),
(2,  1, 2026, 12, 4),  (2,  2, 2026, 10, 1),  (2,  3, 2026, 18, 8),
(3,  1, 2026, 12, 5),  (3,  2, 2026, 10, 2),  (3,  3, 2026, 18, 3),
(4,  1, 2026, 12, 1),  (4,  2, 2026, 10, 4),  (4,  3, 2026, 18, 10),
(5,  1, 2026, 12, 2),  (5,  2, 2026, 10, 0),  (5,  3, 2026, 18, 5),
(6,  1, 2026, 12, 4),  (6,  2, 2026, 10, 3),  (6,  3, 2026, 15, 2),
(7,  1, 2026, 12, 2),  (7,  2, 2026, 10, 1),  (7,  3, 2026, 12, 5),
(8,  1, 2026, 12, 10), (8,  2, 2026, 10, 2),  (8,  3, 2026, 15, 4),
(9,  1, 2026, 12, 3),  (9,  2, 2026, 10, 4),  (9,  3, 2026, 12, 0),
(10, 1, 2026, 12, 5),  (10, 2, 2026, 10, 0),  (10, 3, 2026, 15, 7),
(11, 1, 2026, 12, 1),  (11, 2, 2026, 10, 3),  (11, 3, 2026, 12, 2),
(12, 1, 2026, 12, 7),  (12, 2, 2026, 10, 1),  (12, 3, 2026, 15, 3),
(13, 1, 2026, 6,  1),  (13, 2, 2026, 6,  3),  (13, 3, 2026, 0,  0),
(14, 1, 2026, 8,  2),  (14, 2, 2026, 8,  0),  (14, 3, 2026, 10, 4);

-------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO ATTENDANCE (EMP_ID, WORK_DATE, CHECK_IN, CHECK_OUT, STATUS, REMARKS) VALUES
(1,  '2026-10-26', '09:00', '18:15', 'PRESENT',  NULL),                            -- normal day
(2,  '2026-10-26', '09:10', '18:20', 'PRESENT',  NULL),                            -- normal day
(6,  '2026-10-26', '10:45', '18:30', 'PRESENT',  'Late arrival'),                  -- late
(10, '2026-10-23', '10:15', '18:30', 'PRESENT',  'Late arrival - traffic'),        -- late
(7,  '2026-10-23', '09:30', '20:30', 'PRESENT',  'Overtime - release deployment'), -- overtime
(8,  '2026-10-21', NULL,    NULL,    'ON_LEAVE', 'Sick leave'),                    -- approved sick leave
(11, '2026-10-21', NULL,    NULL,    'ON_LEAVE', 'Sick leave'),                    -- approved sick leave
(3,  '2026-10-22', NULL,    NULL,    'ON_LEAVE', 'Casual leave'),                  -- approved casual leave (day 1)
(3,  '2026-10-23', NULL,    NULL,    'ON_LEAVE', 'Casual leave'),                  -- approved casual leave (day 2)
(9,  '2026-10-22', '09:30', '13:30', 'HALF_DAY', 'Doctor appointment'),            -- half day
(12, '2026-10-22', NULL,    NULL,    'ABSENT',   'No intimation'),                 -- absent, no leave request
(4,  '2026-10-20', NULL,    NULL,    'HOLIDAY',  'Public holiday'),                -- holiday
(5,  '2026-10-27', '09:00', NULL,    'PRESENT',  NULL),                            -- today, not checked out yet
(13, '2026-10-26', '09:30', '18:30', 'PRESENT',  NULL),                            -- intern, normal day
(14, '2026-10-27', '09:30', NULL,    'PRESENT',  NULL);                            -- today, not checked out yet

-------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO SALARY_RECORDS
    (EMP_ID, PAY_MONTH, PAY_YEAR, BASIC_SALARY, ALLOWANCES, BONUS, DEDUCTIONS, PAYMENT_DATE, PAYMENT_STATUS)
VALUES
-- September 2026
(1,  9, 2026, 120000, 24000, 0, 12000, '2026-09-30', 'PAID'),
(2,  9, 2026, 110000, 22000, 0, 11000, '2026-09-30', 'PAID'),
(3,  9, 2026,  95000, 19000, 0,  9500, '2026-09-30', 'PAID'),
(4,  9, 2026, 125000, 25000, 0, 12500, '2026-09-30', 'PAID'),
(5,  9, 2026, 100000, 20000, 0, 10000, '2026-09-30', 'PAID'),
(6,  9, 2026,  65000, 13000, 0,  6500, '2026-09-30', 'PAID'),
(7,  9, 2026,  60000, 12000, 0,  6000, '2026-09-30', 'PAID'),
(8,  9, 2026,  55000, 11000, 0,  5500, '2026-09-30', 'PAID'),
(9,  9, 2026,  48000,  9600, 0,  4800, NULL,         'FAILED'),
(10, 9, 2026,  58000, 11600, 0,  5800, '2026-09-30', 'PAID'),
(11, 9, 2026,  45000,  9000, 0,  4500, '2026-09-30', 'PAID'),
(12, 9, 2026,  52000, 10400, 0,  5200, '2026-09-30', 'PAID'),
(13, 9, 2026,  35000,  7000, 0,  3500, '2026-09-30', 'PAID'),
(14, 9, 2026,  70000, 14000, 0,  7000, '2026-09-30', 'PAID'),
-- October 2026 (payroll not run yet)
(1,  10, 2026, 120000, 24000, 10000, 12000, NULL, 'PENDING'),
(2,  10, 2026, 110000, 22000, 10000, 11000, NULL, 'PENDING'),
(3,  10, 2026,  95000, 19000, 10000,  9500, NULL, 'PENDING'),
(4,  10, 2026, 125000, 25000, 10000, 12500, NULL, 'PENDING'),
(5,  10, 2026, 100000, 20000, 10000, 10000, NULL, 'PENDING'),
(6,  10, 2026,  65000, 13000, 0,      6500, NULL, 'PENDING'),
(7,  10, 2026,  60000, 12000, 0,      6000, NULL, 'PENDING'),
(8,  10, 2026,  55000, 11000, 0,      5500, NULL, 'PENDING'),
(9,  10, 2026,  48000,  9600, 0,      4800, NULL, 'PENDING')

