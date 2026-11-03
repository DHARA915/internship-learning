-- UPDATE (GIVE GRANT AND REVOKE)

-- QUESTION: 15 Create a read-only role: CREATE ROLE readonly_user LOGIN
-- PASSWORD 'test123'. GRANT CONNECT on database. GRANT SELECT on all tables.
-- Test that INSERT fails with this role.

-- CREATE READ-ONLY LOGIN ROLE -readonly_user ---------------------------------------------------------------------------------------------------------------------------

CREATE ROLE readonly_user
LOGIN 
PASSWORD 'test123';

-- GIVE GRANT CONNECT ON DATABASE

SELECT CURRENT_DATABASE();

GRANT CONNECT ON DATABASE "EmplyeeManagement" 
TO readonly_user;

-- GRANT schema Usage
GRANT USAGE ON SCHEMA public TO readonly_user;

-- grant select on all databse's tables.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Important: This does not automatically grant SELECT on tables created in the future.

-- To cover future tables created by your admin account:
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO readonly_user;

-- UPDATE GRANT 
GRANT UPDATE ON TABLE EMP TO readonly_user;

-- REVOKING GRANT
REVOKE UPDATE ON TABLE EMP FROM readonly_user;

-- CREATING MULTIPLE USER FOR MULTIPLE OPERATION MANAGING. ---------------------------------------------------------------------------------------------------------------------------------------------

CREATE ROLE readwrite_user LOGIN PASSWORD 'test123';

CREATE ROLE insert_user LOGIN PASSWORD 'test123';

CREATE ROLE update_user LOGIN PASSWORD 'test123';

CREATE ROLE delete_user LOGIN PASSWORD 'test123';

GRANT CONNECT ON DATABASE "EmplyeeManagement"
TO readwrite_user, insert_user, update_user, delete_user;

GRANT USAGE ON SCHEMA Public
TO readwrite_user, insert_user, update_user, delete_user;

-- GRANT FOR readwrite_user
GRANT SELECT, INSERT , UPDATE ON TABLE EMP,DEPT TO readwrite_user;

-- GRANT FOR insert_user
GRANT SELECT, INSERT ON DEPT TO insert_user;

-- GRANT FOR delete_user
GRANT SELECT,DELETE ON DEPT TO delete_user;

-- CHECKING ALL ROLES ---------------------------------------------------------------------------------------------------------------------
SELECT rolname
FROM pg_roles
WHERE rolname IN (
    'readwrite_user',
    'insert_user',
    'update_user',
    'delete_user'
);

