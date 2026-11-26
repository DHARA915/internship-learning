
export const up = (pgm) => {
  pgm.createTable("refresh_tokens", {
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
      onDelete: "CASCADE",
    },

    token_hash: {
      type: "text",
      notNull: true,
      unique: true,
    },

    family_id: {
      type: "uuid",
      notNull: true,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

    is_revoked: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    revoked_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("refresh_tokens", "user_id");

  pgm.createIndex("refresh_tokens", "family_id");
};

export const down = (pgm) => {
  pgm.dropTable("refresh_tokens");
};
