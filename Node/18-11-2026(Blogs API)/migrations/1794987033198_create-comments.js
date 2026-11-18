
export const up = (pgm) => {
    // Create comments table
    pgm.createTable("comments", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        post_id: {
            type: "uuid",
            notNull: true,
            references: "posts(id)",
            onDelete: "CASCADE"
        },

        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "RESTRICT"
        },

        content: {
            type: "text",
            notNull: true
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    // Indexes for comment queries
    pgm.createIndex("comments", "post_id");
    pgm.createIndex("comments", "user_id");

    // Supports chronological, cursor-based pagination
    pgm.createIndex("comments", ["post_id", "created_at", "id"]);
};

export const down = (pgm) => {
    pgm.dropTable("comments");
};
