
export const up = (pgm) => {
    pgm.createTable("refresh_tokens", {
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

        family_id: {
            type: "uuid",
            notNull: true
        },

        expires_at: {
            type: "timestamptz",
            notNull: true
        },

        is_revoked: {
            type: "boolean",
            notNull: true,
            default: false
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        revoked_at: {
            type: "timestamptz"
        }
    });

    // Index user-based token lookup
    pgm.createIndex("refresh_tokens", "user_id");

    // Index token family lookup
    pgm.createIndex("refresh_tokens", "family_id");

    // Index token expiration cleanup
    pgm.createIndex("refresh_tokens", "expires_at");
};

export const down = (pgm) => {
    pgm.dropTable("refresh_tokens");
};
