import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import type { AppDispatch, RootState } from "../../Redux/store";
import {
  changeQuantity,
  removeFromCart,
  clearCart,
} from "../../Redux/Slices/cartSlice";
import { formatPrice } from "../../utils/MenuItemdata";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.cart.items);
  const [placed, setPlaced] = useState(false);

  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

  const placeOrder = () => {
    // the array that will become the order
    console.log("Order:", JSON.stringify({ items, total }, null, 2));
    dispatch(clearCart());
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="size-14 text-green-600" />
        <h2 className="text-xl font-semibold text-primary">Order placed</h2>
        <p className="text-sm text-secondary">
          Your order has been sent to the kitchen.
        </p>
        <Link
          to="/user/home"
          className="mt-2 inline-flex h-11 items-center rounded-lg bg-button-primary px-6 text-sm font-semibold text-primary hover:bg-button-primary-hover"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <ShoppingCart className="size-12 text-tertiary" />
        <h2 className="text-lg font-semibold text-primary">
          Your cart is empty
        </h2>
        <Link
          to="/user/home"
          className="inline-flex h-11 items-center rounded-lg bg-button-primary px-6 text-sm font-semibold text-primary hover:bg-button-primary-hover"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
      {/* Cart lines */}
      <div className="overflow-hidden rounded-xl border border-line bg-primary">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex gap-4 border-b border-line p-4 last:border-b-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="size-20 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    {item.name}
                  </h3>
                  <p className="text-xs text-tertiary">
                    {formatPrice(item.basePrice)} base
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.key))}
                  aria-label={`Remove ${item.name}`}
                  className="text-tertiary hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {item.modifiers.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {item.modifiers.map((m) => (
                    <li
                      key={m.optionId}
                      className="flex justify-between text-xs text-secondary"
                    >
                      <span>
                        {m.groupName}: {m.name}
                      </span>
                      <span>
                        {m.price > 0 ? `+${formatPrice(m.price)}` : "Free"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(changeQuantity({ key: item.key, delta: -1 }))
                    }
                    aria-label="Decrease quantity"
                    className="flex size-8 items-center justify-center rounded-md border border-line text-primary hover:bg-black/5"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-primary">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(changeQuantity({ key: item.key, delta: 1 }))
                    }
                    aria-label="Increase quantity"
                    className="flex size-8 items-center justify-center rounded-md border border-line text-primary hover:bg-black/5"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <span className="text-base font-semibold text-primary">
                  {formatPrice(item.lineTotal)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="h-fit rounded-xl border border-line bg-primary p-5">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Order summary
        </h2>

        <div className="flex justify-between text-sm text-secondary">
          <span>Items</span>
          <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
        </div>

        <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          className="mt-5 h-11 w-full rounded-lg bg-button-primary text-sm font-semibold text-primary hover:bg-button-primary-hover"
        >
          Place order · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
};

export default CartPage;