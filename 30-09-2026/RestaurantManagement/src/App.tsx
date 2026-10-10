import Login from "./modules/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WithAuth from "./components/withAuth";
import PrimaryLayout from "./layout/PrimaryLayout";
import AdminRoute from "./modules/admin/AdminRoute";
import UserRoutes from "./modules/user/UserRoute";
import ComparePage from "./modules/CompareProducts/ComparePage";
import { Toaster } from "./components/ui/toast";
import ImageGallary from "./modules/ImageGallary/ImageGallary";
import "./App.css";

const ProtectedAdminRoutes = WithAuth(AdminRoute, "admin");
const ProtectedUserDashboard = WithAuth(UserRoutes, "user");
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          <Route element={<PrimaryLayout />}>
            <Route path="/admin/*" element={<ProtectedAdminRoutes />} />
            <Route path="/user/*" element={<ProtectedUserDashboard />} />
          </Route>

          <Route path="/admin/compare" element={<ComparePage/>} />
          <Route path="/admin/gallary" element={<ImageGallary/>} />

          {/* Default */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </>
  );
}

export default App;
