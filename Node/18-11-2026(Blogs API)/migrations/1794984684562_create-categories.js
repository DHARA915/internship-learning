
export const up = (pgm) => {

    // Create categories table
    pgm.createTable("categories", {

        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        name: {
            type: "varchar(100)",
            notNull: true,
            unique: true
        },

        slug: {
            type: "varchar(120)",
            notNull: true,
            unique: true
        },

        description: {
            type: "text"
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

};

export const down = (pgm) => {

    // Rollback categories table
    pgm.dropTable("categories");

};
