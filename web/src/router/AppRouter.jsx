
import { BrowserRouter, Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';


import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import CartPage from '../pages/cart/CartPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import AdminCategoryManagementPage from '../pages/categories/AdminCategoryManagementPage';
import AdminCouponManagementPage from '../pages/coupons/AdminCouponManagementPage';
import UserOrdersPage from '../pages/orders/UserOrdersPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import AdminOrderManagementPage from '../pages/orders/AdminOrderManagementPage';
import CheckoutPage from '../pages/payments/CheckoutPage';
import ProductListPage from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import AdminProductManagementPage from '../pages/products/AdminProductManagementPage';
import UserReviewHistoryPage from '../pages/reviews/UserReviewHistoryPage';
import AdminReviewManagementPage from '../pages/reviews/AdminReviewManagementPage';
import AdminDashboardPage from '../pages/users/AdminDashboardPage';
import AdminUserManagementPage from '../pages/users/AdminUserManagementPage';
import ChangePasswordPage from '../pages/users/ChangePasswordPage';
import UserAddressesPage from '../pages/users/UserAddressesPage';
import UserProfilePage from '../pages/users/UserProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/HomePage';


function AppRouter() {
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


        <Route path='/' element={<MainLayout />}>
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='orders' element={<UserOrdersPage />} />
          <Route path='orders/:id' element={<OrderDetailPage />} />
          <Route path='profile' element={<UserProfilePage />} />
          <Route path='profile/addresses' element={<UserAddressesPage />} />
          <Route path='profile/change-password' element={<ChangePasswordPage />} />
          <Route path='reviews/history' element={<UserReviewHistoryPage />} />
        </Route>


        <Route path='/admin' element={<MainLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path='users' element={<AdminUserManagementPage />} />
          <Route path='products' element={<AdminProductManagementPage />} />
          <Route path='categories' element={<AdminCategoryManagementPage />} />
          <Route path='orders' element={<AdminOrderManagementPage />} />
          <Route path='coupons' element={<AdminCouponManagementPage />} />
          <Route path='reviews' element={<AdminReviewManagementPage />} />
        </Route>


        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;