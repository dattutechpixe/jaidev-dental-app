import React from "react";
import Login from "../pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Layout from "../components/outlet/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Setting from "../pages/setting/Setting";
import ResetPassword from "../pages/authentication/ResetPassword";
import ProductList from "../pages/product/ProductList";
import AddProduct from "../pages/product/AddProduct";
import BlogList from "../pages/blog/BlogList";
import AddBlog from "../pages/blog/AddBlog";
import BannerList from "../pages/banner/BannerList";
import AddBanner from "../pages/banner/AddBanner";

const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Setting />} />

          {/* Product Routes */}
          <Route path="product/products" element={<ProductList />} />
          <Route path="product/add-product" element={<AddProduct />} />
          <Route path="product/edit-product/:id" element={<AddProduct />} />

          {/* Blog Routes */}
          <Route path="blog/blogs" element={<BlogList />} />
          <Route path="blog/add-blog" element={<AddBlog />} />
          <Route path="blog/edit-blog/:id" element={<AddBlog />} />

          {/* Other Resource routes */}
          <Route path="banner/banners" element={<BannerList />} />
          <Route path="banner/add-banners" element={<AddBanner />} />
          <Route path="banner/edit-banner/:id" element={<AddBanner />} />

        </Route>
      </Routes>
    </div>
  );
};

export default MainRoute;
