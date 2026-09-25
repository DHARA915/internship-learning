import './App.css'
import PrimaryLayout from './layout/PrimaryLayout'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from './modules/Registration/Registration'
import ProductManagement from './modules/Product Management/ProductManagement';

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route element={<PrimaryLayout />}>
          <Route path="/Registration" element={<Registration />} />
          <Route path="/product-management" element={<ProductManagement />} />
         
        </Route>
      {/* Default rote */}
      <Route
        path="/"
        element={<Navigate to="/Registration" replace />}
      />
      </Routes>

    </BrowserRouter>
  )
}

export default App
