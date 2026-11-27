import productRepository from "../repositories/product.repository.js";
import categoryRepository from "../repositories/category.repository.js";
import {
    getCache,
    setCache,
    deleteCache,
    deleteCachePattern,
} from "../utils/cache.js";

class ProductService {

    async invalidateProductCache(productId = null) {
        await deleteCachePattern("ecommerce:products:list:*");

        if (productId) {
            await deleteCache(`ecommerce:products:${productId}`);
        }
    }

    async createProduct(productData) {
        const { category_id } = productData;

        if (category_id !== undefined && category_id !== null) {
            const category = await categoryRepository.findById(category_id);

            if (!category) {
                const error = new Error("Category not found");
                error.statusCode = 400;
                throw error;
            }

            if (!category.is_active) {
                const error = new Error("Cannot assign an inactive category");
                error.statusCode = 400;
                throw error;
            }
        }

        const product = await productRepository.create({
            ...productData,
            is_active: true,
        });

        await this.invalidateProductCache();

        return product;
    }

    async getAllProducts({
        page,
        limit,
        search,
        category_id,
        min_price,
        max_price,
        sort_by,
        sort_order,
    }) {
        const offset = (page - 1) * limit;

        // Generate a unique cache key for these filters
        const cacheKey = [
            "ecommerce:products:list",
            `page:${page}`,
            `limit:${limit}`,
            `search:${encodeURIComponent(search ?? "")}`,
            `category:${category_id ?? "all"}`,
            `min:${min_price ?? "all"}`,
            `max:${max_price ?? "all"}`,
            `sort:${sort_by}`,
            `order:${sort_order}`,
        ].join(":");

        // Check Redis cache
        const cachedProducts = await getCache(cacheKey);

        if (cachedProducts) {
            return cachedProducts;
        }

        // Fetch products from PostgreSQL
        const { products, total } = await productRepository.findAll({
            limit,
            offset,
            search,
            category_id,
            min_price,
            max_price,
            sort_by,
            sort_order,
        });

        const response = {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        // Store response in Redis
        await setCache(cacheKey, response);

        return response;
    }

    async updateProduct(productId, productData) {
        // Check whether product exists
        const existingProduct = await productRepository.findById(productId);

        if (!existingProduct) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        // Validate category if provided
        if (
            productData.category_id !== undefined &&
            productData.category_id !== null
        ) {
            const category = await categoryRepository.findById(
                productData.category_id
            );

            if (!category) {
                const error = new Error("Category not found");
                error.statusCode = 400;
                throw error;
            }

            if (!category.is_active) {
                const error = new Error("Cannot assign an inactive category");
                error.statusCode = 400;
                throw error;
            }
        }

        // Preserve existing values for fields not provided
        const updatedData = {
            category_id: productData.category_id ?? existingProduct.category_id,
            name: productData.name ?? existingProduct.name,
            description: productData.description ?? existingProduct.description,
            price: productData.price ?? existingProduct.price,
            stock: productData.stock ?? existingProduct.stock,
            image_url: productData.image_url ?? existingProduct.image_url,
            is_active: productData.is_active ?? existingProduct.is_active,
        };

        const updatedProduct = await productRepository.update(
            productId,
            updatedData
        );

        // Invalidate product caches
        await this.invalidateProductCache(productId);

        return updatedProduct;
    }

    async getProductById(productId, user) {
        // Find product from database
        const product = await productRepository.findById(productId);

        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        // Inactive products are visible only to admins
        if (!product.is_active && user?.role !== "admin") {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

}

export default new ProductService();
