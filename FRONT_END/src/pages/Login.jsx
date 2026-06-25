import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, SetLoginForm } from "../store/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const inputClass =
  "w-full p-3 rounded-lg border outline-none transition-colors " +
  "border-amber-400 dark:border-amber-500/60 " +
  "bg-white dark:bg-slate-800/80 " +
  "text-slate-800 dark:text-slate-100 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500";

const Login = () => {
  const [form, setForm] = useState({ Email: "", Password: "" });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Email || !form.Password) {
      toast.error("Please fill in all fields");
      return;
    }
    dispatch(LoginUser(form));
  };

  useEffect(() => {
    if (error && error !== "") toast.error(error);
  }, [error]);

  return (
    <div
      onClick={() => dispatch(SetLoginForm())}
      className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900
                   border border-transparent dark:border-slate-700/60
                   p-8 rounded-2xl shadow-xl dark:shadow-black/40
                   w-full max-w-md
                   transition-colors duration-300"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-1 text-center text-amber-500 dark:text-amber-400
                       font-['Playfair_Display']">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-7">
          Log in to your account
        </p>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={form.Email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={form.Password}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Sign up hint */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            onClick={() => dispatch(SetLoginForm())}
            className="text-amber-500 dark:text-amber-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer py-3 rounded-lg font-semibold
                     bg-amber-500 hover:bg-amber-600
                     dark:bg-amber-500 dark:hover:bg-amber-400
                     text-white transition-colors duration-200
                     shadow-md hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;