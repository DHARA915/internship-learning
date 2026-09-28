import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from './components/ProductCard'
import { ShoppingCart } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'


const BuyNowPage = () => {

  const navigate = useNavigate()

  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0);

  console.log("From byNow Page:", cartItems)

  const products = useSelector((state) => state.products.products)
  console.log("All Products...", products)


  const handleBuy = (product) => {
    console.log("Selected product:", product);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4">

      {/* HEADER */}
      {/* <div>
        <h1 className="text-2xl font-bold text-tertiary">
          Buy Products
        </h1>

        <p className="text-sm text-secondary">
          Browse and purchase available products.
        </p>
      </div> */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tertiary">
            Buy Products
          </h1>

          <p className="text-sm text-secondary">
            Browse and purchase available products.
          </p>
        </div>

        <button
          onClick={() => navigate("/products/cart")}
          type="button"
          className="relative rounded-lg border border-border p-2 text-tertiary transition hover:bg-background"
        >
          <ShoppingCart size={24} />

          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
}

export default BuyNowPage
