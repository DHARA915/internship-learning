
export const up = (pgm) => {
  pgm.createTable("cart_items", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },

    cart_id: {
      type: "bigint",
      notNull: true,
      references: '"carts"',
      onDelete: "CASCADE",
    },

    product_id: {
      type: "bigint",
      notNull: true,
      references: '"products"',
      onDelete: "RESTRICT",
    },

    quantity: {
      type: "integer",
      notNull: true,
      default: 1,
    },

    unit_price: {
      type: "numeric(10,2)",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("cart_items", "cart_items_quantity_check", {
    check: "quantity > 0",
  });

  pgm.addConstraint("cart_items", "cart_items_unit_price_check", {
    check: "unit_price >= 0",
  });

  pgm.addConstraint("cart_items", "cart_items_cart_product_unique", {
    unique: ["cart_id", "product_id"],
  });

  pgm.createIndex("cart_items", "product_id");
};

export const down = (pgm) => {
  pgm.dropTable("cart_items");
};
