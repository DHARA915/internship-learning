export const up = (pgm) => {
  pgm.createIndex(
    "categories",
    "LOWER(TRIM(name))",
    {
      name: "categories_name_unique_idx",
      unique: true,
    }
  );
};

export const down = (pgm) => {
  pgm.dropIndex(
    "categories",
    "LOWER(TRIM(name))",
    {
      name: "categories_name_unique_idx",
    }
  );
};