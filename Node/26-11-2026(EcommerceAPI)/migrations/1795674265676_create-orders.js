
export const up = (pgm) => {
  pgm.createTable("orders", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },

    user_id: {
      type: "bigint",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },

    order_number: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },

    status: {
      type: "varchar(30)",
      notNull: true,
      default: "pending",
    },

    payment_status: {
      type: "varchar(30)",
      notNull: true,
      default: "pending",
    },

    subtotal: {
      type: "numeric(10,2)",
      notNull: true,
    },

    total_amount: {
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

  pgm.addConstraint("orders", "orders_status_check", {
    check: "status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')",
  });

  pgm.addConstraint("orders", "orders_payment_status_check", {
    check: "payment_status IN ('pending', 'paid', 'failed', 'refunded')",
  });

  pgm.addConstraint("orders", "orders_subtotal_check", {
    check: "subtotal >= 0",
  });

  pgm.addConstraint("orders", "orders_total_amount_check", {
    check: "total_amount >= 0",
  });

  pgm.createIndex("orders", ["user_id", "created_at"]);
};

export const down = (pgm) => {
  pgm.dropTable("orders");
};
