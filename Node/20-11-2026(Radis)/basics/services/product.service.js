
import productRepository from "../repository/product.repository.js";
import cacheService from "../cache/cache.service.js";

const CACHE_TTL = 300; // 5 minutes
const LIST_CACHE_TTL = 120; // 2 minutes

// Reusable cache invalidation helper
async function invalidateProductCaches(id = null) {
    try {
        // Delete individual product cache
        if (id !== null) {
            await cacheService.delete(`product:${id}`);
        }

        // Delete all product list cache keys
        const deletedCount = await cacheService.deletePattern("products:*");

        console.log("Product list cache keys deleted:", deletedCount);

    } catch (error) {
        console.error("Cache invalidation error:", error.message);
    }
}

const productService = {

    // GET PRODUCT BY ID - Cache Aside
    async getProductById(id) {
        const cacheKey = `product:${id}`;

        // 1. Check Redis
        try {
            const cachedProduct = await cacheService.get(cacheKey);

            if (cachedProduct !== null) {
                console.log("Cache HIT:", cacheKey);
                return cachedProduct;
            }

            console.log("Cache MISS:", cacheKey);

        } catch (error) {
            console.error("Redis GET error:", error.message);
        }

        // 2. Fetch from PostgreSQL
        const product = await productRepository.findById(id);

        if (!product) {
            return null;
        }

        // 3. Store in Redis
        try {
            await cacheService.set(cacheKey, product, CACHE_TTL);

            console.log("Product stored in Redis:", cacheKey);

        } catch (error) {
            console.error("Redis SET error:", error.message);
        }

        return product;
    },

    // GET ALL PRODUCTS - Cache Aside
    async getProducts() {
        const cacheKey = "products:page:1:limit:10";

        // 1. Check Redis
        try {
            const cachedProducts = await cacheService.get(cacheKey);

            if (cachedProducts !== null) {
                console.log("Cache HIT:", cacheKey);
                return cachedProducts;
            }

            console.log("Cache MISS:", cacheKey);

        } catch (error) {
            console.error("Redis GET error:", error.message);
        }

        // 2. Fetch from PostgreSQL
        const products = await productRepository.findAll({
            limit: 10,
            offset: 0
        });

        // 3. Store in Redis
        try {
            await cacheService.set(
                cacheKey,
                products,
                LIST_CACHE_TTL
            );

            console.log("Product list stored in Redis:", cacheKey);

        } catch (error) {
            console.error("Redis SET error:", error.message);
        }

        return products;
    },

    // CREATE PRODUCT - Write Through Cache
    async createProduct(productData) {
        // 1. Insert into PostgreSQL
        const product = await productRepository.create(productData);

        // 2. Store newly created product in Redis
        try {
            const cacheKey = `product:${product.id}`;

            await cacheService.set(
                cacheKey,
                product,
                CACHE_TTL
            );

            console.log("Write-through cache SET:", cacheKey);

        } catch (error) {
            console.error("Redis SET error:", error.message);
        }

        // 3. Invalidate product list caches
        await invalidateProductCaches();

        return product;
    },

    // UPDATE PRODUCT - Cache Invalidation
    async updateProduct(id, updates) {
        // 1. Update PostgreSQL
        const product = await productRepository.update(id, updates);

        if (!product) {
            return null;
        }

        // 2. Invalidate individual and list caches
        await invalidateProductCaches(id);

        return product;
    },

    // DELETE PRODUCT - Cache Invalidation
    async deleteProduct(id) {
        // 1. Delete from PostgreSQL
        const product = await productRepository.delete(id);

        if (!product) {
            return null;
        }

        // 2. Invalidate individual and list caches
        await invalidateProductCaches(id);

        return product;
    }

};

export default productService;
