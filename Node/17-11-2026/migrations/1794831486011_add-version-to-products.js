
export const up = (pgm) => {
    pgm.addColumn("products", {
        version: {
            type: "integer",
            notNull: true,
            default: 1
        }
    });
};

export const down = (pgm) => {
    pgm.dropColumn("products", "version");
};
