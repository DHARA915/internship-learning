
import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./Admindashboard";
import AddMenuItems from "./AddMenuItems";
import AddMenuSection from "./AddMenuSection";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="menu-sections" element={<AddMenuSection />} />
      <Route path="menu-items" element={<AddMenuItems />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;