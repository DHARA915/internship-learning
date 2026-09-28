import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    increaseQuantity, decreaseQuantity, removeFromCart, clearCart
} from "./CartSlice"

import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { buyProducts } from './ProductSlice'


const Cart = () => {

    const dispatch = useDispatch();

    const products = useSelector(
        (state) => state.products.products
    );

    const cartItems = useSelector((state) => state.cart.items)
    console.log("From Cart cartItems:", cartItems)

    // Total number of products
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    console.log("Total Items:", totalItems);
    console.log("Total Price:", totalPrice);

    const handleBuyNow = () => {
        cartItems.forEach((item) => {
            dispatch(
                buyProducts({
                    id: item.id,
                    quantity: item.quantity,
                })
            );

            dispatch(removeFromCart(item.id));
        });
    };

    return (
        <div className="flex h-full flex-col gap-6 p-4">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-tertiary">
                        Your Cart
                    </h1>

                    <p className="text-sm text-secondary">
                        Review your selected products before purchase.
                    </p>
                </div>

                {/* CLEAR CART */}
                {cartItems.length > 0 && (
                    <button
                        type="button"
                        onClick={() => dispatch(clearCart())}
                        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-tertiary transition hover:bg-background"
                    >
                        <Trash2 size={17} />
                        Clear Cart
                    </button>
                )}

            </div>

            {/* ================= EMPTY CART ================= */}
            {cartItems.length === 0 ? (

                <div className="flex flex-1 flex-col items-center justify-center gap-3">

                    <ShoppingCart
                        size={50}
                        className="text-secondary"
                    />

                    <h2 className="text-lg font-semibold text-tertiary">
                        Your cart is empty
                    </h2>

                    <p className="text-sm text-secondary">
                        Add some products to your cart.
                    </p>

                </div>

            ) : (

                <div className="flex flex-col gap-6">

                    {/* ================= CART ITEMS ================= */}
                    <div className="flex flex-col gap-4">

                        {cartItems.map((item) => {

                            // Individual product total
                            const itemTotal =
                                Number(item.price) * item.quantity;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-5 rounded-xl border border-border bg-secondary p-4"
                                >

                                    {/* PRODUCT IMAGE */}
                                    <div className="h-24 w-24 shrink-0 rounded-lg bg-background p-2">

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-contain"
                                        />

                                    </div>

                                    {/* PRODUCT DETAILS */}
                                    <div className="flex flex-1 flex-col gap-1">

                                        <h2 className="text-base font-semibold text-tertiary">
                                            {item.name}
                                        </h2>

                                        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                                            {item.category}
                                        </p>

                                        <p className="text-sm text-secondary">
                                            ₹{Number(item.price).toLocaleString("en-IN")}
                                            {" "}per item
                                        </p>

                                    </div>

                                    {/* ================= QUANTITY ================= */}
                                    <div className="flex items-center gap-3">

                                        {/* DECREASE */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (item.quantity <= 1) {
                                                    dispatch(removeFromCart(item.id));
                                                } else {
                                                    dispatch(decreaseQuantity(item.id));
                                                }
                                            }}
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-tertiary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        {/* QUANTITY */}
                                        <span className="w-6 text-center font-semibold text-tertiary">
                                            {item.quantity}
                                        </span>

                                        {/* INCREASE */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch(increaseQuantity(item.id))
                                            }
                                            disabled={item.quantity >= item.stock}
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-tertiary transition hover:bg-background"
                                        >
                                            <Plus size={16} />
                                        </button>

                                        <p
                                            className={`mt-1 text-xs font-medium ${item.quantity >= item.stock
                                                ? "text-red-500"
                                                : "text-secondary"
                                                }`}
                                        >
                                            {item.quantity >= item.stock
                                                ? "Out of Stock"
                                                : ` available`}
                                        </p>

                                    </div>

                                    {/* ================= ITEM TOTAL ================= */}
                                    <div className="w-32 text-right">

                                        <p className="text-xs text-secondary">
                                            Item Total
                                        </p>

                                        <p className="font-bold text-tertiary">
                                            ₹{itemTotal.toLocaleString("en-IN")}
                                        </p>

                                    </div>


                                </div>
                            );
                        })}

                    </div>

                    {/* ================= CART SUMMARY ================= */}
                    <div className="ml-auto w-full max-w-md rounded-xl border border-border bg-secondary p-5">

                        {/* TOTAL ITEMS */}
                        <div className="flex items-center justify-between">

                            <span className="text-sm text-secondary">
                                Total Items
                            </span>

                            <span className="font-semibold text-tertiary">
                                {totalItems}
                            </span>

                        </div>

                        <div className="my-4 border-t border-border" />

                        {/* TOTAL PRICE */}
                        <div className="flex items-center justify-between">

                            <span className="text-lg font-semibold text-tertiary">
                                Total Price
                            </span>

                            <span className="text-2xl font-bold text-tertiary">
                                ₹{totalPrice.toLocaleString("en-IN")}
                            </span>

                        </div>

                        {/* BUY NOW */}
                        <button
                             onClick={handleBuyNow}
                            type="button"
                            className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary transition hover:opacity-90"
                        >
                            Buy Now
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Cart
