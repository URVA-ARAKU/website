import React, { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/common/Loader';
import GlobalLoadingOverlay from './components/common/GlobalLoadingOverlay';


// Lazy load public components
const HomePage = lazy(() => import('./pages/HomePage'));
const Layout = lazy(() => import('./components/layout/Layout'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AboutPage = lazy(() => import('./pages/About'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CheckoutForm = lazy(() => import('./components/CheckoutForm'));
const Shipping = lazy(() => import('./pages/Shipping'));

const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

// Lazy load admin components
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminTransactions = lazy(() => import('./pages/admin/AdminTransactions'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminAddProduct = lazy(() => import('./components/admin/AddProduct'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminFeaturedProducts = lazy(() => import('./pages/admin/FeaturedProduct'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminManageProduct = lazy(() => import('./components/admin/ManageProduct'));
const AdminOrderDetails = lazy(() => import('./pages/admin/AdmiOrderDetails'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Other pages
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const TrackShipment = lazy(() => import('./pages/TrackShipment'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
    return (
        <>
            <GlobalLoadingOverlay />
            <ToastContainer position="bottom-center" />
            <div className="flex flex-col min-h-screen">
                <Router>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="about" element={<AboutPage />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="category/:categorySlug" element={<CategoryPage />} />
                                <Route path="product/:productId" element={<ProductDetails />} />
                                <Route path="search" element={<Navigate to="/products" replace />} />
                                <Route path="track-shipment" element={<TrackShipment />} />
                                <Route path="terms" element={<TermsAndConditions />} />
                                <Route path="privacy" element={<PrivacyPolicy />} />
                                <Route path="shipping-policy" element={<ShippingPolicy />} />
                                <Route path="refund-policy" element={<RefundPolicy />} />
                                <Route path="cart" element={<CartPage />} />
                                <Route path="my-orders" element={<MyOrders />} />
                                <Route path="/order/:id" element={<OrderDetails />} />
                            </Route>

                            <Route path="shipping" element={<Shipping />} />
                            <Route path="checkout" element={<CheckoutForm />} />

                            {/* Admin Login - Public */}
                            <Route path="/admin/login" element={<AdminLogin />} />

                            {/* Protected Admin routes */}
                            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="banners" element={<AdminBanners />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="featured" element={<AdminFeaturedProducts />} />
                                <Route path="products/new" element={<AdminAddProduct />} />
                                <Route path="products/:productId" element={<AdminManageProduct />} />
                                <Route path="customers" element={<AdminCustomers />} />
                                <Route path="transactions" element={<AdminTransactions />} />
                                <Route path="coupons" element={<AdminCoupons />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                            </Route>

                            {/* Fallback route */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </Router>
            </div>
        </>
    );
};

export default App;
