
export const up = (pgm) => {

    // Identify refresh tokens belonging to the same login session
    pgm.addColumn("refresh_tokens", {
        family_id: {
            type: "uuid"
        }
    });

    // Assign a family ID to existing refresh tokens
    pgm.sql(`
        UPDATE refresh_tokens
        SET family_id = gen_random_uuid()
        WHERE family_id IS NULL;
    `);

    // Track when a token was revoked
    pgm.addColumn("refresh_tokens", {
        revoked_at: {
            type: "timestamptz"
        }
    });

    // Track which new token replaced the old token
    pgm.addColumn("refresh_tokens", {
        replaced_by_token_id: {
            type: "bigint",
            references: "refresh_tokens(id)",
            onDelete: "SET NULL"
        }
    });

    // Create an index for faster family lookups
    pgm.createIndex("refresh_tokens", "family_id");

    // Make family_id mandatory after populating existing records
    pgm.alterColumn("refresh_tokens", "family_id", {
        notNull: true
    });
};

export const down = (pgm) => {

    // Remove the added columns
    pgm.dropColumn("refresh_tokens", [
        "family_id",
        "revoked_at",
        "replaced_by_token_id"
    ]);

};
