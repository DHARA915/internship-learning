import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createSlug } from "../src/utils/string.utils.js";

describe("createSlug()", () => {
  it("should convert spaces into hyphens", () => {
    assert.equal(createSlug("Hello World"), "hello-world");
  });

  it("should convert text into lowercase", () => {
    assert.equal(createSlug("HELLO NODE JS"), "hello-node-js");
  });

  it("should remove special characters", () => {
    assert.equal(createSlug("Hello World!!!"), "hello-world");
  });

  it("should handle multiple spaces", () => {
    assert.equal(createSlug("Node   JS"), "node-js");
  });

  it("should handle numbers", () => {
    assert.equal(createSlug("Product 123"), "product-123");
  });
});