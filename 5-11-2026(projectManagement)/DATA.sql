-- PROJECT MANAGEMENT DATA

-- SELECT TABLES -------------------------------------------------------------------------------------------------------------------------------------------------------

SELECT * FROM WORKSPACES;
SELECT * FROM USERS;
SELECT * FROM PROJECTS;
SELECT * FROM BOARDS;
SELECT * FROM BOARD_COLUMNS;
SELECT * FROM TASKS;
SELECT * FROM TASK_COMMENTS;
SELECT * FROM LABELS;
SELECT * FROM TASK_LABELS;
SELECT * FROM TASK_HISTORY;

-- WORKSPACES -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO WORKSPACES (NAME, DESCRIPTION)
VALUES
('Vocuone Technologies', 'Software development company'),
('TechNova Solutions', 'Technology and IT services company') RETURNING*;

-- USERS  ----------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO USERS (NAME, EMAIL)
VALUES
('Dhara Patel', 'dhara@gmail.com'),
('Rahul Shah', 'rahul@gmail.com'),
('Priya Mehta', 'priya@gmail.com'),
('Amit Patel', 'amit@gmail.com'),
('Neha Desai', 'neha@gmail.com'),
('Karan Joshi', 'karan@gmail.com') RETURNING *;

-- PROJECTS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO PROJECTS (WORKSPACE_ID, NAME, DESCRIPTION)
VALUES
(1, 'E-Commerce Website', 'Online shopping platform'),
(1, 'CRM Application', 'Customer relationship management'),
(2, 'Hospital Management', 'Hospital management system') RETURNING *;

-- BOARDS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO BOARDS (PROJECT_ID, NAME)
VALUES
(1, 'E-Commerce Development Board'),
(2, 'CRM Development Board'),
(3, 'Hospital Development Board') RETURNING *;

-- BOARD_COLUMNS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO BOARD_COLUMNS (BOARD_ID, NAME, POSITION)
VALUES
-- E-Commerce Board
(1, 'To Do', 1),
(1, 'In Progress', 2),
(1, 'Review', 3),
(1, 'Done', 4),

-- CRM Board
(2, 'To Do', 1),
(2, 'In Progress', 2),
(2, 'Review', 3),
(2, 'Done', 4),

-- Hospital Board
(3, 'To Do', 1),
(3, 'In Progress', 2),
(3, 'Review', 3),
(3, 'Done', 4) RETURNING *;
 
-- TASKS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO TASKS (
    BOARD_COLUMN_ID,
    TITLE,
    DESCRIPTION,
    PRIORITY,
    ASSIGNEE_ID,
    REPORTER_ID,
    ESTIMATED_HOURS,
    ACTUAL_HOURS,
    DUE_DATE,
    CUSTOM_FIELDS,
    CREATED_AT
)
VALUES

-- E-COMMERCE PROJECT
(1, 'Create Login API', 'Implement login API', 'high', 2, 1, 8, 10, CURRENT_DATE - 5, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '20 days'),

(1, 'Create Registration API', 'Implement registration API', 'medium', 2, 1, 6, 7, CURRENT_DATE - 3, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '18 days'),

(1, 'Payment Gateway Integration', 'Integrate payment gateway', 'critical', 2, 3, 12, 15, CURRENT_DATE - 4, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '15 days'),

(2, 'Create Product API', 'Develop product CRUD APIs', 'high', 2, 1, 10, 12, CURRENT_DATE - 2, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '14 days'),

(2, 'Design Homepage', 'Create responsive homepage', 'medium', 3, 1, 8, 5, CURRENT_DATE + 2, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '10 days'),

(2, 'Shopping Cart Module', 'Implement shopping cart', 'high', 4, 1, 12, 9, CURRENT_DATE + 3, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '9 days'),

(3, 'Order Management API', 'Create order management APIs', 'high', 5, 3, 10, 8, CURRENT_DATE - 1, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '8 days'),

(3, 'Product Search', 'Implement product search', 'medium', 3, 1, 6, 7, CURRENT_DATE + 4, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '12 days'),

(4, 'Database Schema Design', 'Design e-commerce database', 'high', 1, 1, 8, 9, CURRENT_DATE - 10, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '25 days'),

(4, 'User Profile Module', 'Implement user profile', 'medium', 5, 1, 6, 5, CURRENT_DATE - 8, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '24 days'),

(4, 'Fix Navbar Bug', 'Resolve navigation issue', 'low', 6, 3, 3, 2, CURRENT_DATE - 6, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '22 days'),

(4, 'Checkout Validation', 'Validate checkout details', 'critical', 4, 2, 5, 6, CURRENT_DATE - 2, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '11 days'),

-- CRM PROJECT

(5, 'Create Customer API', 'Implement customer API', 'high', 2, 1, 8, 9, CURRENT_DATE - 5, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '20 days'),

(5, 'Create Lead Management', 'Implement lead management', 'critical', 2, 1, 12, 14, CURRENT_DATE - 3, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '18 days'),

(5, 'Create Employee Module', 'Manage CRM employees', 'medium', 2, 3, 7, 6, CURRENT_DATE + 5, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '16 days'),

(6, 'Lead Assignment', 'Assign leads to employees', 'high', 2, 1, 6, 8, CURRENT_DATE - 4, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '15 days'),

(6, 'Customer Dashboard', 'Create customer dashboard', 'medium', 3, 1, 10, 7, CURRENT_DATE + 2, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '12 days'),

(6, 'Email Notification', 'Implement email notifications', 'high', 4, 3, 5, 4, CURRENT_DATE + 6, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '10 days'),

(7, 'Sales Report API', 'Generate sales reports', 'critical', 5, 1, 12, 16, CURRENT_DATE - 2, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '14 days'),

(7, 'Customer Search', 'Implement customer search', 'medium', 3, 2, 5, 6, CURRENT_DATE + 3, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '13 days'),

(8, 'CRM Database Design', 'Design CRM database', 'high', 1, 1, 10, 11, CURRENT_DATE - 9, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '25 days'),

(8, 'Employee Permissions', 'Implement permissions', 'medium', 5, 3, 8, 9, CURRENT_DATE - 7, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '24 days'),

(8, 'Fix Login Bug', 'Fix CRM login issue', 'critical', 6, 1, 4, 5, CURRENT_DATE - 6, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '22 days'),

(8, 'Lead Validation', 'Validate lead information', 'high', 4, 2, 7, 8, CURRENT_DATE - 1, '{"client":"TechNova"}', CURRENT_TIMESTAMP - INTERVAL '11 days'),

-- HOSPITAL PROJECT 

(9, 'Create Patient API', 'Implement patient API', 'high', 2, 1, 8, 10, CURRENT_DATE - 6, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '20 days'),

(9, 'Doctor Registration', 'Implement doctor registration', 'medium', 2, 1, 6, 7, CURRENT_DATE - 4, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '18 days'),

(9, 'Appointment Booking', 'Create appointment booking', 'critical', 2, 3, 12, 14, CURRENT_DATE + 4, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '15 days'),

(10, 'Patient Dashboard', 'Create patient dashboard', 'high', 2, 1, 10, 12, CURRENT_DATE - 3, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '14 days'),

(10, 'Doctor Schedule', 'Implement doctor scheduling', 'medium', 3, 1, 8, 6, CURRENT_DATE - 2, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '12 days'),

(10, 'Medicine Inventory', 'Manage medicine inventory', 'high', 4, 1, 10, 8, CURRENT_DATE + 2, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '10 days'),

(11, 'Billing Module', 'Create billing functionality', 'critical', 5, 3, 12, 10, CURRENT_DATE + 5, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '9 days'),

(11, 'Appointment Validation', 'Validate appointment booking', 'medium', 3, 1, 5, 7, CURRENT_DATE + 3, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '12 days'),

(12, 'Hospital Database Design', 'Design hospital database', 'high', 1, 1, 10, 11, CURRENT_DATE - 10, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '25 days'),

(12, 'Patient Report', 'Generate patient reports', 'medium', 5, 3, 8, 9, CURRENT_DATE - 8, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '24 days'),

(12, 'Fix Appointment Bug', 'Fix appointment booking error', 'critical', 6, 1, 4, 5, CURRENT_DATE - 6, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '22 days'),

(12, 'Doctor Search', 'Implement doctor search', 'high', 4, 2, 6, 8, CURRENT_DATE - 1, '{"client":"Vocuone"}', CURRENT_TIMESTAMP - INTERVAL '11 days') RETURNING * ;

-- TASK_COMMENTS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO TASK_COMMENTS (TASK_ID, USER_ID, COMMENT)
VALUES
(1, 2, 'Login API development started.'),
(1, 3, 'Please add email validation.'),
(2, 2, 'Registration API is under development.'),
(3, 4, 'Payment gateway credentials are required.'),
(4, 2, 'Product API implementation is in progress.'),
(5, 3, 'Homepage design completed. Please review.'),
(6, 4, 'Cart functionality needs testing.'),
(9, 1, 'Database schema approved.'),
(13, 2, 'Customer API needs additional validation.'),
(16, 3, 'Lead assignment logic implemented.'),
(19, 5, 'Sales report API needs optimization.'),
(22, 1, 'CRM database design completed.'),
(25, 2, 'Patient API development started.'),
(27, 3, 'Appointment booking validation required.'),
(34, 1, 'Hospital database design approved.'),
(36, 6, 'Appointment bug has been fixed.') RETURNING *;

-- LABELS -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO LABELS (NAME)
VALUES
('Frontend'),
('Backend'),
('Bug'),
('Urgent'),
('Database'),
('Testing'),
('API'),
('Documentation') RETURNING *;

-- TASK_LABELS -------------------------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO TASK_LABELS (TASK_ID, LABEL_ID)
VALUES
-- E-Commerce
(1, 2),
(1, 7),
(2, 2),
(3, 2),
(3, 4),
(4, 2),
(5, 1),
(6, 1),
(6, 6),
(9, 5),
(10, 1),
(11, 3),
(12, 3),

-- CRM
(13, 2),
(14, 7),
(16, 2),
(17, 1),
(19, 4),
(20, 1),
(22, 5),
(23, 6),
(24, 3),

-- Hospital
(25, 2),
(26, 7),
(27, 4),
(28, 1),
(30, 5),
(32, 6),
(34, 5),
(36, 3),
(36, 4) RETURNING *;

-- TASK_HISTORY -------------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO TASK_HISTORY (
    TASK_ID,
    OLD_STATUS,
    NEW_STATUS,
    CHANGED_BY,
    CHANGED_AT
)
VALUES

-- E-COMMERCE

(9, 'To Do', 'In Progress', 2, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(9, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(9, 'Review', 'Done', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(10, 'To Do', 'In Progress', 5, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(10, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(10, 'Review', 'Done', 5, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(7, 'To Do', 'In Progress', 5, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(7, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(4, 'To Do', 'In Progress', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- CRM

(21, 'To Do', 'In Progress', 5, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(21, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(21, 'Review', 'Done', 5, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(22, 'To Do', 'In Progress', 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(22, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(22, 'Review', 'Done', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(19, 'To Do', 'In Progress', 5, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(19, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(16, 'To Do', 'In Progress', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- HOSPITAL

(33, 'To Do', 'In Progress', 1, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(33, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(33, 'Review', 'Done', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(34, 'To Do', 'In Progress', 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(34, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(34, 'Review', 'Done', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(31, 'To Do', 'In Progress', 5, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(31, 'In Progress', 'Review', 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(28, 'To Do', 'In Progress', 2, CURRENT_TIMESTAMP - INTERVAL '2 days') RETURNING *;


