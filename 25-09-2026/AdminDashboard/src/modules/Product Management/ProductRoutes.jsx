import React from 'react'
import ProductManagement from './ProductManagement'
import { Routes, Route, Navigate } from "react-router-dom";
import BuyNowPage from './BuyNowPage';
import Cart from './Cart';

const ProductRoutes = () => {
  return (
    <Routes>
          {/* Default Product page */}
      <Route
        index
        element={<Navigate to="manage" replace />}
      />

      {/* Product Management */}
      <Route
        path="manage"
        element={<ProductManagement />}
      />

      {/* Show all  Products for Buy */}
      <Route
        path="allProducts"
        element={<BuyNowPage />}
      />

      {/* Buy Products */}
      <Route
        path="cart"
        element={<Cart />}
      />

    </Routes>
  )
}

export default ProductRoutes
