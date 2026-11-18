
export const up = (pgm) => {
    // Create users table
    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
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
            default: "reader"
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true
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

    // Restrict user roles
    pgm.addConstraint("users", "users_role_check", {
        check: "role IN ('admin', 'author', 'reader')"
    });

    // Index for role-based queries
    pgm.createIndex("users", "role");
};

export const down = (pgm) => {
    // Rollback users table
    pgm.dropTable("users");
};
