
export const up = (pgm) => {
  pgm.createTable("categories", {
    id: {
      type: "bigint",
      primaryKey: true,
      sequenceGenerated: {
        precedence: "ALWAYS",
      },
    },

    name: {
      type: "varchar(100)",
      notNull: true,
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
};

export const down = (pgm) => {
  pgm.dropTable("categories");
};
