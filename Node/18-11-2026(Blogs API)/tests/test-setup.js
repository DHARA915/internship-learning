
import { Client } from "pg";
import { execSync } from "node:child_process";

const TEST_DB_NAME = "Blogs_test";

const databaseConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

export const setupTestDatabase = async () => {
  const adminClient = new Client({
    ...databaseConfig,
    database: "postgres"
  });

  await adminClient.connect();

  try {
    // Terminate existing connections to the test database.
    await adminClient.query(
      `SELECT pg_terminate_backend(pid)
       FROM pg_stat_activity
       WHERE datname = $1
       AND pid <> pg_backend_pid()`,
      [TEST_DB_NAME]
    );

    // Remove old test database, if present.
    await adminClient.query(
      `DROP DATABASE IF EXISTS "${TEST_DB_NAME}"`
    );

    // Create a fresh test database.
    await adminClient.query(
      `CREATE DATABASE "${TEST_DB_NAME}"`
    );

    console.log("Test database created successfully.");
  } finally {
    await adminClient.end();
  }

  const testEnv = {
    ...process.env,
    NODE_ENV: "test",
    DB_NAME: TEST_DB_NAME,
    DATABASE_URL:
      `postgres://${encodeURIComponent(databaseConfig.user)}:` +
      `${encodeURIComponent(databaseConfig.password)}@` +
      `${databaseConfig.host}:${databaseConfig.port}/${TEST_DB_NAME}`
  };

  // Run existing database migrations.
  execSync("npm run migrate:up", {
    stdio: "inherit",
    env: testEnv
  });

  // Run existing seed script.
  execSync("npm run seed", {
    stdio: "inherit",
    env: testEnv
  });

  console.log("Test database migrated and seeded successfully.");
};

export const teardownTestDatabase = async (pool) => {
  // Close the application's PostgreSQL pool first.
  if (pool) {
    await pool.end();
  }

  const adminClient = new Client({
    ...databaseConfig,
    database: "postgres"
  });

  await adminClient.connect();

  try {
    await adminClient.query(
      `SELECT pg_terminate_backend(pid)
       FROM pg_stat_activity
       WHERE datname = $1
       AND pid <> pg_backend_pid()`,
      [TEST_DB_NAME]
    );

    await adminClient.query(
      `DROP DATABASE IF EXISTS "${TEST_DB_NAME}"`
    );

    console.log("Test database removed successfully.");
  } finally {
    await adminClient.end();
  }
};
