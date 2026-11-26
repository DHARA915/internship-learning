export const up = (pgm) => {
  pgm.createTable("products", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },

    category_id: {
      type: "bigint",
      references: '"categories"',
      onDelete: "SET NULL",
    },

    name: {
      type: "varchar(200)",
      notNull: true,
    },

    description: {
      type: "text",
    },

    price: {
      type: "numeric(10,2)",
      notNull: true,
    },

    stock: {
      type: "integer",
      notNull: true,
      default: 0,
    },

    image_url: {
      type: "text",
    },

    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
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

  pgm.addConstraint("products", "products_price_check", {
    check: "price >= 0",
  });

  pgm.addConstraint("products", "products_stock_check", {
    check: "stock >= 0",
  });

  pgm.createIndex("products", "category_id");

  pgm.createIndex("products", "is_active");
};

export const down = (pgm) => {
  pgm.dropTable("products");
};
