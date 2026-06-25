import logo from "@/assets/images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { ActivateLink, ToggleCart, ToggleFavorit } from "../store/storeSlice";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { SetLoginForm } from "../store/userSlice";
import DropDown from "./dropDown";
import { useDarkMode } from "@/hooks/use-darkMode";

function Navbar() {
  const dispatch = useDispatch();
  const { active } = useSelector((state) => state.store);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuth } = useSelector((state) => state.user);

  const [dark, setDark] = useDarkMode();

  const navLinks = [
    { to: "/",        label: "Home"    },
    { to: "/About",   label: "About"   },
    { to: "/Shop",    label: "Shop"    },
    { to: "/Contact", label: "Contact" },
  ];

  return (
    <nav className="flex z-50 top-0 fixed backdrop-blur-md shadow-lg w-full h-16 
                    justify-between items-center text-xl text-white
                    bg-amber-950/75 dark:bg-slate-900/80
                    transition-colors duration-300">

      {/* Logo */}
      <Link to="/" className="flex cursor-pointer items-center ml-3">
        <img src={logo} alt="logo" className="w-16 h-16" />
        <h2 className="font-bold text-[#00C6FF]">Salah Store</h2>
      </Link>

      {/* Links */}
      <div className="links hidden md:flex">
        {navLinks.map(({ to, label }) => (
          <Link
            key={label}
            to={to}
            onClick={() => dispatch(ActivateLink(label))}
            className={`mr-5 cursor-pointer transition-colors duration-200
              hover:text-amber-300
              ${active === label ? "text-amber-300 font-semibold" : "text-white"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Icons */}
      <div className="icons flex items-center gap-4 mr-4">

        
        

        {/* Cart */}
        <div
          className="relative cursor-pointer hover:text-amber-300 transition-colors"
          onClick={() => dispatch(ToggleCart())}
        >
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 
                             bg-red-500 rounded-full" />
          )}
          <FaCartShopping />
        </div>

        
        {/* Favoris */}
        <div
          className="cursor-pointer hover:text-red-400 transition-colors"
          onClick={() => dispatch(ToggleFavorit())}
        >
          <FaHeart />
        </div>

        {/* Auth */}
        {isAuth ? (
          <DropDown />
        ) : (
          <button
            onClick={() => dispatch(SetLoginForm())}
            className="px-4 py-2 text-sm font-extrabold cursor-pointer text-white 
                       rounded-3xl border border-transparent
                       hover:border-amber-500 hover:text-amber-400 
                       transition-colors duration-300"
          >
            Login
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;