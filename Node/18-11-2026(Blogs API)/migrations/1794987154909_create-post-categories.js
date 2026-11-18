export const up = (pgm) => {
    pgm.createTable("post_categories", {
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

        category_id: {
            type: "uuid",
            references: "categories(id)",
            onDelete: "SET NULL"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.addConstraint(
        "post_categories",
        "post_categories_unique",
        {
            unique: ["post_id", "category_id"]
        }
    );

    pgm.createIndex("post_categories", "category_id");
};

export const down = (pgm) => {
    pgm.dropTable("post_categories");
};