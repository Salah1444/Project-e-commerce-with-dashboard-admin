import logo from "@/assets/images/logo.svg";
import { FaFacebook, FaGithub, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActivateLink } from "../store/storeSlice";

function Footer() {
  const active   = useSelector(st => st.store.active);
  const dispatch = useDispatch();

  const navLinks = [
    { label: "Home",    to: "/"        },
    { label: "About",   to: "/About"   },
    { label: "Shop",    to: "/Shop"    },
    { label: "Contact", to: "/Contact" },
  ];

  return (
    <footer className="bg-amber-950 dark:bg-slate-900 text-white  px-6 py-10
                       border-t border-amber-900 dark:border-slate-700
                       transition-colors duration-300">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ── Logo + Description + Socials ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <strong className="text-xl">E-Commerce</strong>
          </div>

          <p className="text-sm text-justify leading-relaxed
                        bg-amber-900/60 dark:bg-slate-800/60
                        p-3 rounded text-amber-100 dark:text-slate-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptas officia culpa esse quibusdam nostrum maxime.
          </p>

          <div>
            <strong className="block mb-2 text-amber-200 dark:text-slate-300">
              Follow us :
            </strong>
            <div className="flex gap-4 text-xl">
              <FaGithub   className="icon" />
              <FaFacebook className="icon" />
              <FaWhatsapp className="icon" />
            </div>
          </div>
        </div>

        {/* ── Pages ── */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-amber-200 dark:text-slate-200">
            Pages
          </h2>
          <ul className="space-y-2 ml-5 list-disc">
            {navLinks.map(({ label, to }) => (
              <li
                key={label}
                className={`transition-all duration-200 cursor-pointer
                  hover:text-amber-300 hover:translate-x-1
                  ${active === label ? "text-amber-300 font-semibold" : "text-amber-100 dark:text-slate-400"}`}
              >
                {/* ✅ Bug fix : ActivateLink(label) pas ActivateLink({label}) */}
                <Link to={to} onClick={() => dispatch(ActivateLink(label))}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-amber-200 dark:text-slate-200">
            Contact
          </h2>
          <div className="space-y-3 text-sm text-amber-100 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-amber-400 shrink-0" />
              support@ecommerce.com
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-amber-400 shrink-0" />
              +212 6 00 00 00 00
            </p>
            <p className="flex items-center gap-2">
              <span className="shrink-0">📍</span>
              Morocco
            </p>
          </div>
        </div>

      </div>

      {/* ── Bottom ── */}
      <div className="border-t border-amber-800 dark:border-slate-700
                      mt-10 pt-4 text-center text-sm
                      text-amber-200 dark:text-slate-500">
        © {new Date().getFullYear()} E-Commerce. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;