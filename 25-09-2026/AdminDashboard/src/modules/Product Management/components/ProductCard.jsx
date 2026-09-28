// import React from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../CartSlice";

// const ProductCard = ({ product}) => {

//   const dispatch = useDispatch();

//   const handleAddToCart = () =>{
//     console.log("Product from Card",product)
//     dispatch(addToCart(product))
//   }

//   return (
//     <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

//       {/* IMAGE */}
//       <div className="flex h-52 shrink-0 items-center justify-center border-b border-border bg-background p-5">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
//         />
//       </div>

//       {/* DETAILS */}
//       <div className="flex flex-1 flex-col p-5">

//         {/* PRODUCT NAME */}
//         <div className="min-h-[68px]">
//           <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-tertiary">
//             {product.name}
//           </h2>

//           <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary">
//             {product.category}
//           </p>
//         </div>

//         {/* DESCRIPTION */}
//         <p className="mt-3 h-10 line-clamp-2 text-sm leading-5 text-secondary">
//           {product.description}
//         </p>

//         {/* PRICE + STOCK */}
//         <div className="mt-5 flex items-end justify-between">
//           <div>
//             <p className="text-xs text-secondary">
//               Price
//             </p>

//             <p className="text-xl font-bold text-tertiary">
//               ₹{Number(product.price).toLocaleString("en-IN")}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-xs text-secondary">
//               Available
//             </p>

//             <p
//               className={`text-sm font-semibold ${
//                 product.stock > 0
//                   ? "text-green-600"
//                   : "text-red-500"
//               }`}
//             >
//               {product.stock > 0
//                 ? `${product.stock} in stock`
//                 : "Out of stock"}
//             </p>
//           </div>
//         </div>

//         {/* BUY BUTTON */}
//         <button
//           type="button"
//           onClick={handleAddToCart}
//           disabled={product.stock <= 0}
//           className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../CartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  // Find this product in cart
  const cartItem = cartItems.find(
    (item) => item.id === product.id
  );

  // Current quantity in cart
  const cartQuantity = cartItem?.quantity || 0;

  // Check whether all available stock is already in cart
  const isMaxQuantity = cartQuantity >= product.stock;

  const handleAddToCart = () => {
    if (isMaxQuantity) return;

    dispatch(addToCart(product));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-52 shrink-0 items-center justify-center border-b border-border bg-background p-5">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">

        <div className="min-h-[68px]">
          <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-tertiary">
            {product.name}
          </h2>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary">
            {product.category}
          </p>
        </div>

        <p className="mt-3 h-10 line-clamp-2 text-sm leading-5 text-secondary">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-secondary">Price</p>

            <p className="text-xl font-bold text-tertiary">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-secondary">
              Available
            </p>

            <p
              className={`text-sm font-semibold ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isMaxQuantity}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.stock <= 0
            ? "Out of Stock"
            : isMaxQuantity
              ? "Maximum Stock Added"
              : "Add to Cart"}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;