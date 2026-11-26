
export const up = (pgm) => {
  pgm.createTable("carts", {
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
      unique: true,
      references: '"users"',
      onDelete: "CASCADE",
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
  pgm.dropTable("carts");
};
