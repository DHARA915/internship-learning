// Creating- categories migration file.

export const up = (pgm) => {

    pgm.createTable("categories", {

        id: {
            type: "serial",
            primaryKey: true
        },

        name: {
            type: "varchar(100)",
            notNull: true,
            unique: true
        },

        description: {
            type: "text"
        },

        created_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("NOW()")
        },

        updated_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("NOW()")
        }

    });

};

export const down = (pgm) => {

    pgm.dropTable("categories");

};
