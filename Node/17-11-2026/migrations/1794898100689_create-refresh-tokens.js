export const up = (pgm) => {

    pgm.createTable("refresh_tokens", {

        id: {
            type: "bigint",
            primaryKey: true,
            generated: "always",
            identity: true
        },

        user_id: {
            type: "integer",
            notNull: true,
            references: '"users"',
            onDelete: "CASCADE"
        },

        token_hash: {
            type: "varchar(64)",
            notNull: true,
            unique: true
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
            default: pgm.func("NOW()")
        }

    });

    pgm.createIndex("refresh_tokens", "user_id");

    pgm.createIndex("refresh_tokens", "expires_at");

};

export const down = (pgm) => {

    pgm.dropTable("refresh_tokens");

};