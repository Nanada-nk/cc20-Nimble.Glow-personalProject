
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import ProductListPage from '../pages/products/ProductListPage.jsx';
import ProductDetailPage from '../pages/products/ProductDetailPage.jsx';
import CategoryListPage from '../pages/categories/CategoryListPage.jsx';

import CartPage from '../pages/cart/CartPage.jsx';
import CheckoutPage from '../pages/payments/CheckoutPage.jsx';
import UserOrdersPage from '../pages/orders/UserOrdersPage.jsx';
import OrderDetailPage from '../pages/orders/OrderDetailPage.jsx';
import UserProfilePage from '../pages/users/UserProfilePage.jsx';
import EditProfilePage from '../pages/users/EditProfilePage.jsx';
import UserAddressesPage from '../pages/users/UserAddressesPage.jsx';
import ChangePasswordPage from '../pages/users/ChangePasswordPage.jsx';
import UserReviewHistoryPage from '../pages/reviews/UserReviewHistoryPage.jsx';


import NotFoundPage from '../pages/NotFoundPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import authStore from '../stores/authStore.js';

import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage.jsx';
import AdminProductManagementPage from '../pages/admin/AdminProductManagementPage.jsx';
import AdminCategoryManagementPage from '../pages/admin/AdminCategoryManagementPage.jsx';
import AdminOrderManagementPage from '../pages/admin/AdminOrderManagementPage.jsx';
import AdminCouponManagementPage from '../pages/admin/AdminCouponManagementPage.jsx';
import AdminReviewManagementPage from '../pages/admin/AdminReviewManagementPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

function AppRouter() {
  const checkAuth = authStore((state) => state.checkAuth)
  useEffect(() => {
    checkAuth();
  }, [])
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='forgot-password' element={<ForgotPasswordPage />} />
          <Route path='reset-password' element={<ResetPasswordPage />} />
          <Route path='products' element={<ProductListPage />} />
          <Route path='products/:id' element={<ProductDetailPage />} />
          <Route path='categories' element={<CategoryListPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout />}>
            <Route path='cart' element={<CartPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='orders' element={<UserOrdersPage />} />
            <Route path='orders/:id' element={<OrderDetailPage />} />
            <Route path='profile' element={<UserProfilePage />} />
            <Route path='profile/edit' element={<EditProfilePage />} />
            <Route path='profile/addresses' element={<UserAddressesPage />} />
            <Route path='profile/change-password' element={<ChangePasswordPage />} />
            <Route path='reviews/history' element={<UserReviewHistoryPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='users' element={<AdminUserManagementPage />} />
            <Route path='products' element={<AdminProductManagementPage />} />
            <Route path='categories' element={<AdminCategoryManagementPage />} />
            <Route path='orders' element={<AdminOrderManagementPage />} />
            <Route path='coupons' element={<AdminCouponManagementPage />} />
            <Route path='reviews' element={<AdminReviewManagementPage />} />
          </Route>
        </Route>


        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;