
import bcrypt from "bcrypt";
import pool from "../src/config/database.js";

const users = [
    {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Admin User",
        email: "admin@blog.com",
        role: "admin"
    },
    {
        id: "22222222-2222-4222-8222-222222222222",
        name: "John Author",
        email: "john@blog.com",
        role: "author"
    },
    {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Sarah Author",
        email: "sarah@blog.com",
        role: "author"
    },
    {
        id: "44444444-4444-4444-8444-444444444444",
        name: "Reader One",
        email: "reader1@blog.com",
        role: "reader"
    },
    {
        id: "55555555-5555-4555-8555-555555555555",
        name: "Reader Two",
        email: "reader2@blog.com",
        role: "reader"
    }
];

const categories = [
    {
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        name: "Technology",
        slug: "technology"
    },
    {
        id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        name: "Programming",
        slug: "programming"
    },
    {
        id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        name: "Web Development",
        slug: "web-development"
    },
    {
        id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        name: "Artificial Intelligence",
        slug: "artificial-intelligence"
    },
    {
        id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        name: "Database",
        slug: "database"
    },
    {
        id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
        name: "Cybersecurity",
        slug: "cybersecurity"
    }
];

const posts = [
    {
        title: "Introduction to Node.js",
        content: "Learn how Node.js works, understand its event-driven architecture, and explore how JavaScript can be used to build backend applications.",
        slug: "introduction-to-nodejs",
        status: "published",
        authorEmail: "john@blog.com",
        categorySlugs: ["technology", "programming"]
    },
    {
        title: "Getting Started with React",
        content: "Explore React fundamentals, components, props, state, and hooks to build modern interactive user interfaces.",
        slug: "getting-started-with-react",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["programming", "web-development"]
    },
    {
        title: "Understanding PostgreSQL",
        content: "Discover relational database concepts, SQL queries, constraints, indexes, and transactions using PostgreSQL.",
        slug: "understanding-postgresql",
        status: "draft",
        authorEmail: "john@blog.com",
        categorySlugs: ["database"]
    },
    {
        title: "The Future of Artificial Intelligence",
        content: "Understand how artificial intelligence is transforming industries through machine learning, automation, and intelligent applications.",
        slug: "future-of-artificial-intelligence",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["technology", "artificial-intelligence"]
    },
    {
        title: "REST API Development with Express",
        content: "Learn how to design RESTful APIs using Express, organize routes, implement middleware, and handle HTTP requests.",
        slug: "rest-api-development-with-express",
        status: "published",
        authorEmail: "john@blog.com",
        categorySlugs: ["programming", "web-development"]
    },
    {
        title: "JavaScript Async and Await Explained",
        content: "Understand asynchronous JavaScript, promises, async functions, await, and error handling with practical examples.",
        slug: "javascript-async-await-explained",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["programming"]
    },
    {
        title: "Database Indexing and Query Optimization",
        content: "Explore database indexes, execution plans, query optimization techniques, and ways to improve application performance.",
        slug: "database-indexing-query-optimization",
        status: "draft",
        authorEmail: "john@blog.com",
        categorySlugs: ["database"]
    },
    {
        title: "Introduction to Machine Learning",
        content: "Learn the basics of machine learning, supervised learning, unsupervised learning, and common real-world applications.",
        slug: "introduction-to-machine-learning",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["technology", "artificial-intelligence"]
    },
    {
        title: "Web Security Best Practices",
        content: "Explore authentication, authorization, password hashing, input validation, secure cookies, and common web vulnerabilities.",
        slug: "web-security-best-practices",
        status: "published",
        authorEmail: "john@blog.com",
        categorySlugs: ["cybersecurity", "web-development"]
    },
    {
        title: "Building Responsive Websites with CSS",
        content: "Learn responsive layouts using CSS Flexbox, Grid, media queries, and mobile-first design principles.",
        slug: "responsive-websites-with-css",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["web-development"]
    },
    {
        title: "JWT Authentication in Node.js",
        content: "Understand JSON Web Tokens, access tokens, refresh tokens, token expiration, and secure authentication workflows.",
        slug: "jwt-authentication-in-nodejs",
        status: "draft",
        authorEmail: "john@blog.com",
        categorySlugs: ["programming", "cybersecurity"]
    },
    {
        title: "MongoDB vs PostgreSQL",
        content: "Compare relational and document databases, explore their data models, and understand when to choose each database.",
        slug: "mongodb-vs-postgresql",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["database"]
    },
    {
        title: "Getting Started with Docker",
        content: "Learn containerization, Docker images, containers, Dockerfiles, and how Docker simplifies application deployment.",
        slug: "getting-started-with-docker",
        status: "draft",
        authorEmail: "john@blog.com",
        categorySlugs: ["technology"]
    },
    {
        title: "Understanding Data Structures and Algorithms",
        content: "Explore arrays, linked lists, stacks, queues, trees, sorting algorithms, and searching techniques.",
        slug: "data-structures-and-algorithms",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["programming"]
    },
    {
        title: "Cybersecurity Threats Every Developer Should Know",
        content: "Understand SQL injection, cross-site scripting, cross-site request forgery, and practical methods to protect applications.",
        slug: "cybersecurity-threats-for-developers",
        status: "published",
        authorEmail: "john@blog.com",
        categorySlugs: ["cybersecurity"]
    },
    {
        title: "Introduction to TypeScript",
        content: "Discover TypeScript types, interfaces, generics, and how static typing improves JavaScript application development.",
        slug: "introduction-to-typescript",
        status: "draft",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["programming", "web-development"]
    },
    {
        title: "How Cloud Computing Works",
        content: "Explore cloud computing fundamentals, deployment models, cloud infrastructure, scalability, and common cloud services.",
        slug: "how-cloud-computing-works",
        status: "published",
        authorEmail: "john@blog.com",
        categorySlugs: ["technology"]
    },
    {
        title: "Clean Code Principles for Backend Developers",
        content: "Learn meaningful naming, separation of concerns, modular architecture, error handling, and maintainable backend coding practices.",
        slug: "clean-code-principles-backend",
        status: "published",
        authorEmail: "sarah@blog.com",
        categorySlugs: ["programming"]
    }
];

const comments = [
    {
        postSlug: "introduction-to-nodejs",
        userEmail: "reader1@blog.com",
        content: "Great introduction to Node.js!"
    },
    {
        postSlug: "introduction-to-nodejs",
        userEmail: "reader2@blog.com",
        content: "The event loop explanation was very helpful."
    },
    {
        postSlug: "getting-started-with-react",
        userEmail: "reader1@blog.com",
        content: "Looking forward to more React tutorials."
    },
    {
        postSlug: "future-of-artificial-intelligence",
        userEmail: "reader2@blog.com",
        content: "AI is definitely changing software development."
    },
    {
        postSlug: "rest-api-development-with-express",
        userEmail: "reader1@blog.com",
        content: "Very useful explanation of Express APIs."
    },
    {
        postSlug: "web-security-best-practices",
        userEmail: "reader2@blog.com",
        content: "Security should always be a priority."
    },
    {
        postSlug: "mongodb-vs-postgresql",
        userEmail: "reader1@blog.com",
        content: "This comparison made the differences much clearer."
    },
    {
        postSlug: "clean-code-principles-backend",
        userEmail: "reader2@blog.com",
        content: "Clean code makes projects much easier to maintain."
    }
];

const seedDatabase = async () => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Seed users
        const passwordHash = await bcrypt.hash("BlogTest@123", 12);
        const userIds = new Map();

        for (const user of users) {
            const result = await client.query(
                `INSERT INTO users
                    (id, name, email, password_hash, role, is_active)
                 VALUES ($1, $2, $3, $4, $5, TRUE)
                 ON CONFLICT (email)
                 DO UPDATE SET
                    name = EXCLUDED.name,
                    password_hash = EXCLUDED.password_hash,
                    role = EXCLUDED.role,
                    is_active = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING id`,
                [
                    user.id,
                    user.name,
                    user.email,
                    passwordHash,
                    user.role
                ]
            );

            userIds.set(user.email, result.rows[0].id);
        }

        // 2. Seed categories
        const categoryIds = new Map();

        for (const category of categories) {
            const result = await client.query(
                `INSERT INTO categories (id, name, slug)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (slug)
                 DO UPDATE SET
                    name = EXCLUDED.name,
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING id`,
                [
                    category.id,
                    category.name,
                    category.slug
                ]
            );

            categoryIds.set(category.slug, result.rows[0].id);
        }

        // 3. Seed posts
        const postIds = new Map();

        for (const post of posts) {
            const authorId = userIds.get(post.authorEmail);

            if (!authorId) {
                throw new Error(`Author not found: ${post.authorEmail}`);
            }


            const publishedAt =
                post.status === "published" ? new Date() : null;

            const result = await client.query(
                `INSERT INTO posts
        (title, content, slug, status, author_id, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug)
     DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        author_id = EXCLUDED.author_id,
        status = EXCLUDED.status,
        published_at = EXCLUDED.published_at,
        updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
                [
                    post.title,
                    post.content,
                    post.slug,
                    post.status,
                    authorId,
                    publishedAt
                ]
            );


            postIds.set(post.slug, result.rows[0].id);
        }

        // 4. Synchronize post-category relationships
        for (const post of posts) {
            const postId = postIds.get(post.slug);

            await client.query(
                `DELETE FROM post_categories
                 WHERE post_id = $1`,
                [postId]
            );

            for (const categorySlug of post.categorySlugs) {
                const categoryId = categoryIds.get(categorySlug);

                if (!categoryId) {
                    throw new Error(
                        `Category not found: ${categorySlug}`
                    );
                }

                await client.query(
                    `INSERT INTO post_categories
                        (post_id, category_id)
                     VALUES ($1, $2)
                     ON CONFLICT (post_id, category_id)
                     DO NOTHING`,
                    [postId, categoryId]
                );
            }
        }

        // 5. Seed comments
        for (const comment of comments) {
            const postId = postIds.get(comment.postSlug);
            const userId = userIds.get(comment.userEmail);

            if (!postId || !userId) {
                throw new Error(
                    `Invalid comment relationship: ${comment.postSlug}`
                );
            }

            // Avoid duplicate sample comments when seeder is rerun.
            const existing = await client.query(
                `SELECT id
                 FROM comments
                 WHERE post_id = $1
                   AND user_id = $2
                   AND content = $3
                 LIMIT 1`,
                [postId, userId, comment.content]
            );

            if (existing.rowCount === 0) {
                await client.query(
                    `INSERT INTO comments
                        (post_id, user_id, content)
                     VALUES ($1, $2, $3)`,
                    [postId, userId, comment.content]
                );
            }
        }

        await client.query("COMMIT");

        console.log("Database seeded successfully!");
        console.log(`Users: ${users.length}`);
        console.log(`Categories: ${categories.length}`);
        console.log(`Posts: ${posts.length}`);
        console.log(`Comments: ${comments.length}`);

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Database seeding failed:", error.message);

        throw error;

    } finally {
        client.release();
        await pool.end();
    }
};

seedDatabase().catch(() => {
    process.exitCode = 1;
});
