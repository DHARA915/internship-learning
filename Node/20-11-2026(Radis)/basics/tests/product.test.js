
import {
  describe,
  it,
  after
} from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";

let createdProductId;

const validProduct = {
  name: "Supertest Product",
  sku: `TEST-${Date.now()}`,
  category: "Electronics",
  description: "Product created for API testing",
  price: 1999,
  stock_quantity: 50,
  tags: ["electronics", "testing"],
  metadata: {
    brand: "TestBrand",
    color: "Black",
    warranty: "1 year"
  },
  related_product_id: null
};

// Cleanup after tests
after(async () => {
  if (createdProductId) {
    await request(app)
      .delete(`/api/products/${createdProductId}`);
  }
});

describe("Product API", () => {

  // GET /api/products
  it("should return all products with correct format", async () => {
    const response = await request(app)
      .get("/api/products");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    // Support either common response format
    const products =
      response.body.products ?? response.body.data;

    assert.ok(Array.isArray(products));
  });

  // POST /api/products
  it("should create a product with valid data", async () => {
    const response = await request(app)
      .post("/api/products")
      .send(validProduct);

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);

    const product = response.body.data;

    assert.ok(product.id);
    assert.equal(product.name, validProduct.name);
    assert.equal(product.sku, validProduct.sku);
    assert.equal(product.category, validProduct.category);
    assert.equal(product.description, validProduct.description);
    assert.equal(Number(product.price), validProduct.price);
    assert.equal(product.stock_quantity, validProduct.stock_quantity);

    assert.deepEqual(product.tags, validProduct.tags);
    assert.deepEqual(product.metadata, validProduct.metadata);
    assert.equal(product.related_product_id, null);

    createdProductId = product.id;
  });

  // POST /api/products - invalid data
  it("should reject invalid product data", async () => {
    const invalidProduct = {
      ...validProduct,
      name: "",
      sku: `INVALID-${Date.now()}`,
      price: -100
    };

    const response = await request(app)
      .post("/api/products")
      .send(invalidProduct);

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // GET /api/products/:id
  it("should return a product by ID", async () => {
    assert.ok(createdProductId);

    const response = await request(app)
      .get(`/api/products/${createdProductId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    assert.equal(
      String(response.body.data.id),
      String(createdProductId)
    );

    assert.equal(response.body.data.name, validProduct.name);
    assert.equal(response.body.data.sku, validProduct.sku);
  });

  // GET /api/products/:id - not found
  it("should return 404 when product does not exist", async () => {
    const response = await request(app)
      .get("/api/products/999999999");

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
  });

});
