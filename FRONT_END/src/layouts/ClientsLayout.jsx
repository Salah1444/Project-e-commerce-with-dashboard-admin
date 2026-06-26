import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import DropCart from "@/components/DropCart";
import DropFavorit from "@/components/DropFavorit";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SITE_NAME = "Salah Store";

const PAGE_TITLES = {
  "": "Home",
  about: "About Us",
  shop: "Shop",
  contact: "Contact",
};

function ClientsLayout() {
  const { isVisible, DropFavoritState } = useSelector((st) => st.store);
  const { loginForm } = useSelector((st) => st.user);
  const location = useLocation();

  
  useEffect(() => {
    const segment = location.pathname.split("/").filter(Boolean)[0] ?? "";
    const page = PAGE_TITLES[segment.toLowerCase()] ?? segment;
    document.title = page ? `${page} — ${SITE_NAME}` : SITE_NAME;
  }, [location.pathname]);

  return (
    <div className="min-h-screen  flex flex-col dark:bg-gray-800">
      <Navbar />

      <Outlet />

      <Footer />

      {isVisible && <DropCart />}
      {DropFavoritState && <DropFavorit />}
      {loginForm && <Login />}
    </div>
  );
}

export default ClientsLayout;
