
const products = require("../models/product.model");

// Get all products
function getAllProducts() {
    return products;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Create product
function createProduct(data) {
    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name: data.name,
        price: data.price
    };

    products.push(newProduct);

    return newProduct;
}

// Update product
function updateProduct(id, data) {
    const product = getProductById(id);

    if (!product) return null;

    product.name = data.name;
    product.price = data.price;

    return product;
}

// Delete product
function deleteProduct(id) {
    const index = products.findIndex(product => product.id === id);

    if (index === -1) return null;

    return products.splice(index, 1)[0];
}

// Get all products with pagination
// Get products with price filtering, sorting and pagination
function getPaginatedProducts(page, limit, filters) {
    let result = [...products];

    // Minimum price filter
    if (filters.minPrice !== undefined) {
        result = result.filter(
            product => product.price >= filters.minPrice
        );
    }

    // Maximum price filter
    if (filters.maxPrice !== undefined) {
        result = result.filter(
            product => product.price <= filters.maxPrice
        );
    }

    // Sorting
    if (filters.sort) {
        const [field, order] = filters.sort.split(":");

        result.sort((a, b) => {
            return order === "desc"
                ? b[field] - a[field]
                : a[field] - b[field];
        });
    }

    // Pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;

    const items = result.slice(startIndex, startIndex + limit);

    return {
        items,
        page,
        totalPages,
        totalItems
    };
}


module.exports = {
    getPaginatedProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
