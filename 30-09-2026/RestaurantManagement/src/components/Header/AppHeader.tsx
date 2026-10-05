import { useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";

import { adminLinks } from "../../utils/AdminLinks";
import { RESTAURANT_NAME } from "../../utils/restaurantCommon";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { getUserLinks } from "../../utils/UserLinks";
import { ShoppingCart } from "lucide-react";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Location", location); // Debugging line

  const cartCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const isCartPage = location.pathname.startsWith("/user/cart");

  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const menuSections = useSelector(
    (s: RootState) => s.menuSections.menuSections,
  );
  const isAdmin = currentUser?.role === "admin";
  const links = isAdmin ? adminLinks : getUserLinks(menuSections);

  const displayName = currentUser?.name ?? (isAdmin ? "Admin" : "User");
  const initial = displayName.charAt(0).toUpperCase();

  const currentPage = links.find(
    (link) =>
      location.pathname === link.href ||
      location.pathname.startsWith(`${link.href}/`),
  );

  console.log("Current Page:", currentPage); // Debugging line

  const Icon = currentPage?.icon;

  return (
    <header className=" sticky top-0 z-30 flex h-19 shrink-0 items-center justify-between border-b border-line bg-primary px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-secondary hover:bg-brand-soft hover:text-brand" />

        <div className="h-6 w-px bg-line" />

        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-semibold text-primary sm:text-base">
{isCartPage ? "Cart" : (currentPage?.title ?? "Restaurant Management")}            </h1>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex gap-10">

      {!isAdmin && (
  <button
    type="button"
    onClick={() => navigate("/user/cart")}
    aria-label={`Open cart, ${cartCount} items`}
    className="relative flex size-10 items-center justify-center rounded-lg border border-line text-primary hover:bg-black/5"
  >
    <ShoppingCart className="size-5" />
    {cartCount > 0 && (
      <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-button-primary px-1 text-[10px] font-bold leading-5 text-on-brand">
        {cartCount}
      </span>
    )}
  </button>
)}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-primary">{displayName}</p>

          <p className="text-xs text-tertiary">{isAdmin ? "Admin" : "User"}</p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-button-primary text-sm font-semibold text-on-brand">
          {initial}
        </div>
      </div>
      </div>
    </header>
  );
};

export default AppHeader;
