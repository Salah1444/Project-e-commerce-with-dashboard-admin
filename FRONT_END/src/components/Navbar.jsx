import logo from "@/assets/images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { ActivateLink, ToggleCart, ToggleFavorit } from "../store/storeSlice";
import { FaAccessibleIcon, FaCartShopping, FaDatabase } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { FaDashcube, FaHeart } from "react-icons/fa";
import { logout, SetLoginForm } from "../store/userSlice";
import DropDown from "./dropDown";
import { useDarkMode } from "@/hooks/use-darkMode";
import { useState } from "react";
import { Home, Info, ShoppingBag, Phone, LogOut, Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const dispatch = useDispatch();
  const { active } = useSelector((state) => state.store);
  const { cart } = useSelector((state) => state.cart);
  const { user,isAuth } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  const navLinks = [
    { icon: <Home size={18} />, to: "/", label: "Home" },
    { icon: <Info size={18} />, to: "/About", label: "About" },
    { icon: <ShoppingBag size={18} />, to: "/Shop", label: "Shop" },
    { icon: <Phone size={18} />, to: "/Contact", label: "Contact" },
  ];

  return (
    <nav
      className="fixed top-0 z-50 flex h-16 w-full items-center justify-between
                 border-b border-white/10 bg-amber-950/75 text-white shadow-lg
                 backdrop-blur-md transition-colors duration-200
                 dark:border-white/5 dark:bg-slate-900/80"
    >
      {/* Logo */}
      <Link to="/" className="ml-3 flex items-center gap-2">
        <img src={logo} alt="logo" className="h-12 w-12" />
        <h2 className="text-lg font-bold tracking-tight text-amber-300">
          Salah Store
        </h2>
      </Link>

      {/* Links */}
      <div className="hidden items-center gap-1 md:flex">
        {navLinks.map(({ to, label }) => (
          <Link
            key={label}
            to={to}
            onClick={() => dispatch(ActivateLink(label))}
            className="relative px-3 py-2 text-base font-medium text-white/85
                       transition-colors duration-200 hover:text-amber-300"
          >
            {label}
            {active === label && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-amber-300"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Icons */}
      <div className="mr-4 flex items-center gap-4">
        {/* Dark mode */}
        <button
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
          className="text-white/85 transition-colors duration-200 hover:text-amber-300"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Cart */}
        <button
          onClick={() => dispatch(ToggleCart())}
          aria-label="Open cart"
          className="relative md:block hidden text-white/85 transition-colors duration-200 hover:text-amber-300"
        >
          {cart.length > 0 && (
            <span className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
          )}
          <FaCartShopping size={18} />
        </button>

        {/* Favorites */}
        <button
          onClick={() => dispatch(ToggleFavorit())}
          aria-label="Open favorites"
          className="text-white/85  md:block hidden transition-colors duration-200 hover:text-rose-400"
        >
          <FaHeart size={18} />
        </button>

        {/* Auth */}
        {isAuth ? (
          <DropDown />
        ) : (
          <button
            onClick={() => dispatch(SetLoginForm())}
            className="hidden rounded-full border border-transparent px-4 py-1.5 text-sm
                       font-semibold text-white transition-colors duration-200
                       hover:border-amber-400 hover:text-amber-300 md:inline-flex"
          >
            Login
          </button>
        )}

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="fixed right-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64
                         flex-col border-l border-black/10 bg-gray-50 text-gray-900
                         shadow-xl dark:border-white/10 dark:bg-gray-900 dark:text-white md:hidden"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    dispatch(ActivateLink(link.label));
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 text-sm
                             font-medium transition-colors duration-200
                             hover:bg-amber-200/60 dark:hover:bg-gray-800"
                >
                  {link.label}
                  {link.icon}
                </NavLink>
              ))}

              

              <button
                onClick={() => {dispatch(ToggleCart()); setOpen(false)}}
                className="relative flex items-center justify-between px-4 py-3 text-sm
                           font-medium transition-colors duration-200
                         hover:bg-amber-200/60 dark:hover:bg-gray-800"
              >
                <span>Cart</span>
                <span className="relative">
                  {cart.length > 0 && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                  )}
                  <FaCartShopping size={20} />
                </span>
              </button>

              <button
                onClick={() => {
                  dispatch(ToggleFavorit());
                  setOpen(false)
                }}
                className="flex items-center justify-between px-4 py-3 text-sm
                           font-medium transition-colors duration-200
                           hover:bg-amber-200/60 dark:hover:bg-gray-800"
              >
                <span>Favorite</span>
                <FaHeart size={20} />
              </button>

              {isAuth ? (<>
              <button
                onClick={() => {setOpen(false);dispatch(logout())}}
                className="flex items-center justify-between px-4 py-3 text-sm
                           font-medium text-rose-600 transition-colors duration-200
                           hover:bg-rose-500 hover:text-white dark:hover:bg-gray-800"
              >
                Logout
                <LogOut size={18} />
              </button>
                {user?.is_admin ? (<Link
                to={'/admin'}
                className="flex items-center justify-between px-4 py-3 text-sm
                           font-medium transition-colors duration-200
                           hover:bg-amber-200/60 dark:hover:bg-gray-800"
              >
                <span>Dashboard</span>
                <LayoutDashboard size={20} />
              </Link>):""}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="mt-auto flex items-center justify-between gap-3 border-t
                             border-black/10 px-4 py-3 transition-colors duration-200
                             hover:bg-amber-200/60 dark:border-white/10 dark:hover:bg-gray-800"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.FullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.Email}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full
                                  bg-amber-400 font-bold text-white shadow-md dark:bg-amber-500">
                    {user?.FullName?.slice(0,2).toUpperCase()}
                  </div>
                </Link>
                </>
              ) : (
                <button
                  onClick={() => dispatch(SetLoginForm())}
                  className="mt-auto rounded-full border border-transparent px-4 py-2 text-sm
                             font-semibold text-amber-600 transition-colors duration-200
                             hover:border-amber-400 dark:text-amber-300"
                >
                  Login
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;