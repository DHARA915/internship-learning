
export const up = (pgm) => {
    pgm.addColumn("products", {
        created_by: {
            type: "integer",
            references: "users(id)",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }
    });
};

export const down = (pgm) => {
    pgm.dropColumn("products", "created_by");
};
