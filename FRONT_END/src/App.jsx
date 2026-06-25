import "./App.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { fetchCart } from "@/store/cartSlice";
import { fetchFavorites } from "@/store/favoriteSlice";
import { fetchCategories } from "@/store/CategorySlice";
import { getMe } from "@/store/userSlice";
import { fetchVille } from "@/store/villeSlice";
import { fetchStats } from "@/store/adminSlice";
import { fetchProducts } from "@/store/productsSlice";
import ClientsLayout from "./layouts/ClientsLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ValidateOrder from "@/components/ValidateOrder";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import ERROR_PAGE from "./pages/ERROR_PAGE";
import Details from "@/components/Details";
import AdminUsers from "./pages/admin/AdminUsers";
import RegisterAdmin from "./pages/admin/registerAdmin";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCity from "./pages/admin/AdminCity";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import Notifications from "./pages/Notifications";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import OrderDetail from "./pages/OrderDetail";
function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((st) => st.user);
  
  const { DetailisVisible } = useSelector((state) => state.store);

  // Public data — runs once on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchVille());
  }, [dispatch]);

  // Auth-dependent data — runs when token changes
  useEffect(() => {
    if (token) {
      dispatch(getMe());
      dispatch(fetchCart());
      dispatch(fetchFavorites());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user?.is_admin) {
      dispatch(fetchStats());
    }
  }, [dispatch, user?.is_admin]);

  // Admin-only data — runs when user is populated
  
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Client surface */}
        <Route path="/" element={<ClientsLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="shop" element={<Shop />} />
          <Route path="contact" element={<Contact />} />
          <Route path="register" element={<Register />} />
          <Route path="details/:id" element={<Details />}/>
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="order" element={<ValidateOrder />} />
            <Route path="success" element={<Success />} />
            <Route path="cancel" element={<Cancel />} />
          </Route>
        </Route>

        {/* Public utility routes */}

        <Route
          path="/forbidden"
          element={
            <ERROR_PAGE
              status={403}
              message="You don't have access to this page"
              name="FORBIDDEN"
            />
          }
        />
        <Route
          path="*"
          element={
            <ERROR_PAGE
              status={404}
              message="This page is Not Found"
              name="NOT FOUND"
            />
          }
        />

        {/* Admin surface */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<AdminDashboard />} />
            <Route path="products/details" element={<AdminReviews />} />
            <Route path="AddAdmin" name="adminAdd" element={<RegisterAdmin />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="category" element={<AdminCategories />} />
            <Route path="city" element={<AdminCity />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
