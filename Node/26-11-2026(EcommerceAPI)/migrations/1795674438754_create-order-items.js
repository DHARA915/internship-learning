export const up = (pgm) => {
  pgm.createTable("order_items", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },

    order_id: {
      type: "bigint",
      notNull: true,
      references: '"orders"',
      onDelete: "CASCADE",
    },

    product_id: {
      type: "bigint",
      notNull: true,
      references: '"products"',
      onDelete: "RESTRICT",
    },

    product_name: {
      type: "varchar(200)",
      notNull: true,
    },

    quantity: {
      type: "integer",
      notNull: true,
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
  });

  pgm.addConstraint("order_items", "order_items_quantity_check", {
    check: "quantity > 0",
  });

  pgm.addConstraint("order_items", "order_items_unit_price_check", {
    check: "unit_price >= 0",
  });

  pgm.createIndex("order_items", "order_id");
  pgm.createIndex("order_items", "product_id");
};

export const down = (pgm) => {
  pgm.dropTable("order_items");
};