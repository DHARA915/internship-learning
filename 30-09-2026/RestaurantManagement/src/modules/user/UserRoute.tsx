import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import MenuSectionPage from "./MenuSectionPage";
import CartPage from "./CartPage";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home/>} />
      <Route path="menu/:sectionId" element={<MenuSectionPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default UserRoutes;