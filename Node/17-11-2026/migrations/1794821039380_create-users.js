// create users table

export const up = (pgm) => {

    pgm.createTable("users", {

        id: {
            type: "serial",
            primaryKey: true
        },

        name: {
            type: "varchar(100)",
            notNull: true
        },

        email: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        },

        password_hash: {
            type: "varchar(255)",
            notNull: true
        },

        role: {
            type: "varchar(20)",
            notNull: true,
            default: "user"
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

    pgm.dropTable("users");

};
