export const up = (pgm) => {
    pgm.createTable("password_reset_tokens", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE"
        },

        token_hash: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        },

        expires_at: {
            type: "timestamptz",
            notNull: true
        },

        used_at: {
            type: "timestamptz"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    // Index user-based token lookup
    pgm.createIndex(
        "password_reset_tokens",
        "user_id"
    );

    // Index expiration-based cleanup
    pgm.createIndex(
        "password_reset_tokens",
        "expires_at"
    );
};

export const down = (pgm) => {
    pgm.dropTable("password_reset_tokens");
};
