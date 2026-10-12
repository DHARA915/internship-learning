import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import ItemCard from "../../modules/user/components/ItemCard";
import ItemDrawer, {
  getDefaultSelection,
  getUnitPrice,
} from "../../modules/user/components/Itemdrawer";
import type { MenuItem } from "../../utils/MenuItemdata";
import { isMenuLive, fmtTime, daysLabel } from "../../utils/Menusectiondata";

const MenuSectionPage = () => {
  // route param keeps its old name; its value is now a menu id (menu_001 ...)
  const { sectionId } = useParams();
  const menus = useSelector((s: RootState) => s.menus.menus);
  // adjust if your store registers the menu item slice under another key
  const menuItems = useSelector((s: RootState) => s.menuItems.menuItems);

  // All hooks must stay above the early return below
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const menu = menus.find((m) => m.id === sectionId);

  // is the menu being served right now (day + time window)?
  const live = menu ? isMenuLive(menu) : false;

  const openItem = (item: MenuItem) => {
    if (!live) return;
    setSelectedItem(item);
    setOpen(true);
  };

  if (!menu || menu.status !== "Active") {
    return <Navigate to="/user/home" replace />;
  }

  // A menu lists its items by id, in the order the admin chose.
  // An item can belong to several menus.
  const items = menu.itemIds
    .map((id) => menuItems.find((i) => i.id === id))
    .filter((i): i is MenuItem => !!i && i.status === "Active");

  return (
    <div className="p-4 sm:p-6">
      {/* Menu header */}
      <div className="mb-6 flex items-center gap-4">
        {menu.icon ? (
          <img
            src={menu.icon}
            alt=""
            className="size-14 rounded-xl bg-brand-soft object-contain p-1"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-xl bg-brand-soft text-xl font-semibold text-primary">
            {menu.name.charAt(0)}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-primary">{menu.name}</h1>
          <p className="text-sm text-secondary">
            {fmtTime(menu.timing.startTime)} – {fmtTime(menu.timing.endTime)} ·{" "}
            {daysLabel(menu.timing.days)}
          </p>
          {!live && (
            <p className="mt-1 text-xs font-medium text-red-600">
              Not being served right now
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-secondary">
          No items available in this menu yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              startPrice={getUnitPrice(item, getDefaultSelection(item))}
              onClick={() => openItem(item)}
              disabled={!live}
            />
          ))}
        </div>
      )}

      <ItemDrawer
        item={selectedItem}
        menuId={menu.id}
        live={live}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default MenuSectionPage;