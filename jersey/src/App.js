import { Routes, Route ,useLocation } from 'react-router-dom';
import Header from '../src/components/Header.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.js';
import ProfilePage from './pages/ProfilePage.js';
import { useEffect } from 'react';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import JerseyDetailPage from './pages/JerseyDetailPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Shop from './pages/Shop.js';
import Footer from './components/Footer.js';
import ContactUs from './pages/ContactUs.js';
import Orders from './pages/MyAccount/Orders.js';
import Invoice from './pages/MyAccount/Invoice.js';
import Address from './pages/MyAccount/Address.js';
import Security from './pages/MyAccount/Security.js';
import AddressPage from './pages/AddressPage.js';
import AddressForm from './pages/AddressForm.js';
import AddressSelect from './pages/AddressSelect.js';
import PaymentPage from './pages/PaymentPage.js';
import OrderSuccessPage from './pages/OrderSuccessPage.js';



// admin routes
import AdminRouteGuard from './admin/components/AdminRouteGuard.js';
import AdminLayout from './admin/AdminLayout.js';
import Dashboard from './admin/pages/Dashboard.js';
import OrdersPage from './admin/pages/OrdersPage.js';
import AddProductPage from './admin/pages/AddProductPage.js';
import ProductsListPage from './admin/pages/ProductListPage.js';
import Customers from './admin/pages/Customer.js';
import Coupons from './admin/pages/Coupon.js';
import AdminLogin from './pages/auth/AdminLogin.js';


//address save and edit
import AddressAdd from './pages/MyAccount/AddressAdd.js';
import EditProfile from './pages/MyAccount/EditProfile.js';
import CancelOrderPage from './pages/CancelOrderPage.js';


import AOS from 'aos';
import 'aos/dist/aos.css';
import Aboutus from './components/Aboutus.js';




function App() {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');


  useEffect(() => {
    // Enable Bootstrap toasts the React-friendly way
    const toastElList = Array.from(document.querySelectorAll('.toast'));
    toastElList.forEach((toastEl) => {
      new Toast(toastEl); // ✅ use imported Toast class
    });
  }, []);
  useEffect(() => {
  AOS.init({ duration: 1000 });
}, []);

  return (
    <div>
      {!isAdminRoute && <Header />}
      <main className={!isAdminRoute ? "container" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/product/:id" element={<JerseyDetailPage />} />
           {/* <Route path="/jersey" element={<JerseyDetailPage />} /> */}
          <Route path="/cart" element={< CartPage/>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/about" element={<Aboutus />} />

          {/* MyAccount routes */}

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/profile/invoice" element={<Invoice />} />
          <Route path="/profile/address" element={<Address />} />
          <Route path="/profile/security" element={<Security />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/orders/:id/cancel" element={<CancelOrderPage />} />



        {/* adress process */}
          <Route path="/addresspage" element={<AddressPage />} />
          <Route path="/addressform" element={<AddressForm />} />
          <Route path="/addselect" element={<AddressSelect />} />

        {/* payment */}
         <Route path="/payment" element={<PaymentPage />} />
         <Route path="/orderplace" element={<OrderSuccessPage />} />

         {/* Admin Routes with layout */}
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="customer" element={<Customers />} />
          <Route path="coupon" element={<Coupons />} />
          <Route path="login" element={<AdminLogin />} />
       
        
        </Route> */}
        <Route path="/admin" element={<AdminLayout />}>
  {/* Protected admin routes */}
  <Route path="dashboard" element={
    <AdminRouteGuard>
      <Dashboard />
    </AdminRouteGuard>
  } />
  <Route path="orders" element={
    <AdminRouteGuard>
      <OrdersPage />
    </AdminRouteGuard>
  } />
  <Route path="products" element={
    <AdminRouteGuard>
      <ProductsListPage />
    </AdminRouteGuard>
  } />
  <Route path="add-product" element={
    <AdminRouteGuard>
      <AddProductPage />
    </AdminRouteGuard>
  } />
  <Route path="customer" element={
    <AdminRouteGuard>
      <Customers />
    </AdminRouteGuard>
  } />
  <Route path="coupon" element={
    <AdminRouteGuard>
      <Coupons />
    </AdminRouteGuard>
  } />

  {/* Unprotected route */}
  <Route path="login" element={<AdminLogin />} />
</Route>

        {/* save and edit address    */}
         <Route path="saveeditaddress" element={<AddressAdd/>} />



        </Routes>
      </main>
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        id="toastPlacement"
        style={{ zIndex: 9999 }}
      >
        <div id="customToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body" id="toastMessage">Success message</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
     {!isAdminRoute && <Footer/>}
    </div>
  );
}

export default App;
