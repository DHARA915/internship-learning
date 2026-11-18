
export const up = (pgm) => {
    pgm.createTable("posts", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        title: {
            type: "varchar(255)",
            notNull: true
        },

        content: {
            type: "text",
            notNull: true
        },

        slug: {
            type: "varchar(300)",
            notNull: true,
            unique: true
        },

        status: {
            type: "varchar(20)",
            notNull: true,
            default: "draft"
        },

        author_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "RESTRICT"
        },

        version: {
            type: "integer",
            notNull: true,
            default: 1
        },

        published_at: {
            type: "timestamptz"
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

    // Status constraint
    pgm.addConstraint("posts", "posts_status_check", {
        check: "status IN ('draft', 'published')"
    });

    // Version constraint
    pgm.addConstraint("posts", "posts_version_check", {
        check: "version >= 1"
    });

    // Indexes
    pgm.createIndex("posts", "author_id");
    pgm.createIndex("posts", "status");
    pgm.createIndex("posts", "created_at");
    pgm.createIndex("posts", ["created_at", "id"]);
};

export const down = (pgm) => {
    pgm.dropTable("posts");
};
