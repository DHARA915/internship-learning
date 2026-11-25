
// import { describe, it } from "node:test";
// import assert from "node:assert/strict";
// import request from "supertest";
// import { randomUUID } from "node:crypto";
// import "dotenv/config";

// import app from "../src/app.js";

// describe("Authentication Flow", () => {
//   const email = `test-${randomUUID()}@example.com`;
//   const password = "Test@12345";

//   let accessToken;
//   let refreshToken;

//   describe("Register", () => {
//     it("should register a new user", async () => {
//       const response = await request(app)
//         .post("/api/auth/register")
//         .send({
//           name: "Test User",
//           email,
//           password
//         });

//       assert.equal(response.status, 201);
//       assert.equal(response.body.success, true);
//     });
//   });

//   describe("Login", () => {
//     it("should login and receive access and refresh tokens", async () => {
//       const response = await request(app)
//         .post("/api/auth/login")
//         .send({
//           email,
//           password
//         });

//       assert.equal(response.status, 200);
//       assert.equal(response.body.success, true);

//       const data = response.body.data ?? response.body;

//       accessToken = data.accessToken;
//       refreshToken = data.refreshToken;

//       assert.ok(accessToken);
//       assert.ok(refreshToken);
//     });
//   });

//   describe("Protected Routes", () => {
//     it("should access published posts with a valid access token", async () => {
//       const response = await request(app)
//         .get("/api/posts")
//         .set("Authorization", `Bearer ${accessToken}`);

//       assert.equal(response.status, 200);
//     });

//     it("should reject requests without an access token", async () => {
//       const response = await request(app)
//         .get("/api/posts");

//       assert.equal(response.status, 401);
//     });
//   });

//   describe("Refresh Token", () => {
//     it("should rotate access and refresh tokens", async () => {
//       const oldRefreshToken = refreshToken;

//       const response = await request(app)
//         .post("/api/auth/refresh")
//         .send({ refreshToken });

//       assert.equal(response.status, 200);
//       assert.equal(response.body.success, true);

//       const data = response.body.data ?? response.body;

//       accessToken = data.accessToken;
//       refreshToken = data.refreshToken;

//       assert.ok(accessToken);
//       assert.ok(refreshToken);
//       assert.notEqual(refreshToken, oldRefreshToken);
//     });
//   });

//   describe("Logout", () => {
//     it("should logout and revoke the refresh token", async () => {
//       const response = await request(app)
//         .post("/api/auth/logout")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({ refreshToken });

//       assert.equal(response.status, 200);
//       assert.equal(response.body.success, true);
//     });

//     it("should reject a revoked refresh token", async () => {
//       const response = await request(app)
//         .post("/api/auth/refresh")
//         .send({ refreshToken });

//       assert.equal(response.status, 401);
//     });
//   });
// });



import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";

// Load test environment before importing the app or database pool.
dotenv.config({
  path: ".env.test",
  override: true
});

const { setupTestDatabase, teardownTestDatabase } =
  await import("./test-setup.js");

const { default: app } = await import("../src/app.js");
const { default: pool } = await import("../src/config/database.js");

describe("Authentication Flow", () => {
  const email = `test-${randomUUID()}@example.com`;
  const password = "Test@12345";

  let accessToken;
  let refreshToken;
  let databaseReady = false;

  // Runs once before all tests.
  before(async () => {
    await setupTestDatabase();
    databaseReady = true;
  });

  // Runs once after all tests.
  after(async () => {
    if (databaseReady) {
      await teardownTestDatabase(pool);
    } else {
      await pool.end();
    }
  });

  describe("Register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email,
          password
        });

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
    });
  });

  describe("Login", () => {
    it("should login and receive access and refresh tokens", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email,
          password
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);

      const data = response.body.data ?? response.body;

      accessToken = data.accessToken;
      refreshToken = data.refreshToken;

      assert.ok(accessToken, "Access token should exist");
      assert.ok(refreshToken, "Refresh token should exist");
    });
  });

  describe("Protected Routes", () => {
    it("should access published posts with a valid access token", async () => {
      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${accessToken}`);

      assert.equal(response.status, 200);
    });

    it("should reject requests without an access token", async () => {
      const response = await request(app)
        .get("/api/posts");

      assert.equal(response.status, 401);
    });
  });

  describe("Refresh Token", () => {
    it("should rotate access and refresh tokens", async () => {
      const oldRefreshToken = refreshToken;

      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);

      const data = response.body.data ?? response.body;

      accessToken = data.accessToken;
      refreshToken = data.refreshToken;

      assert.ok(accessToken);
      assert.ok(refreshToken);

      assert.notEqual(
        refreshToken,
        oldRefreshToken,
        "Refresh token should be rotated"
      );
    });
  });

  describe("Logout", () => {
    it("should logout and revoke the refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken });

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
    });

    it("should reject a revoked refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      assert.equal(response.status, 401);
    });
  });
});

