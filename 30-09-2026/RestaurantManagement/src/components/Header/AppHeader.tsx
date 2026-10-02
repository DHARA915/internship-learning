import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";

import { adminLinks } from "../../utils/AdminLinks";
import { RESTAURANT_NAME } from "../../utils/restaurantCommon";

const AppHeader = () => {
  const location = useLocation();

  console.log("Location",location); // Debugging line

  const currentPage = adminLinks.find(
    (link) =>
      location.pathname === link.href ||
      location.pathname.startsWith(`${link.href}/`),
  );

  console.log("Current Page:", currentPage); // Debugging line

  const Icon = currentPage?.icon;

  return (
    <header
      className="flex h-19 shrink-0 items-center justify-between border-b border-line bg-primary px-6"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-secondary hover:bg-brand-soft hover:text-brand" />

        <div className="h-6 w-px bg-line" />

        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-sm font-semibold text-primary sm:text-base">
              {currentPage?.title ?? "Restaurant Management"}
            </h1>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-primary">Admin</p>

          <p className="text-xs text-tertiary">Restaurant Manager</p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-button-primary text-sm font-semibold text-on-brand">
          A
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
