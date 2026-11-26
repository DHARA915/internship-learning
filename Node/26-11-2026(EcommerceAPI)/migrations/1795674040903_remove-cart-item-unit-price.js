
export const up = (pgm) => {
  // Remove the saved price from cart_items.
  // Cart prices will now come from the products table.
  pgm.dropColumn("cart_items", "unit_price");
};

export const down = (pgm) => {
  // Restore the column if this migration is rolled back.
  pgm.addColumn("cart_items", {
    unit_price: {
      type: "numeric(10,2)",
      notNull: true,
      default: 0,
    },
  });
};
