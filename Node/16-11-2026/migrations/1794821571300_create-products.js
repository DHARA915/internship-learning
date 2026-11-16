// Creating Product migration table

export const up = (pgm) => {

    pgm.createTable("products", {

        id: {
            type: "serial",
            primaryKey: true
        },

        name: {
            type: "varchar(150)",
            notNull: true
        },

        description: {
            type: "text"
        },

        price: {
            type: "numeric(10,2)",
            notNull: true
        },

        stock: {
            type: "integer",
            notNull: true,
            default: 0
        },

        category_id: {
            type: "integer",
            notNull: true,
            references: "categories(id)",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
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

    // Add CHECK constraints
    pgm.addConstraint("products", "products_price_check", {
        check: "price >= 0"
    });

    pgm.addConstraint("products", "products_stock_check", {
        check: "stock >= 0"
    });

};

export const down = (pgm) => {

    pgm.dropTable("products");

};
