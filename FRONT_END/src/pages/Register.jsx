import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { AddUser, SetLoginForm } from "@/store/userSlice";
import { fetchVille } from "@/store/villeSlice";

export default function Register() {
  const villes = useSelector((st) => st.ville.ville);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVille());
  }, []);

  const [form, setForm] = useState({
    FullName: "",
    Email: "",
    Password: "",
    VilleId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (validator.isEmpty(form.FullName))
      newErrors.FullName = "Full name is required";

    if (validator.isEmpty(form.Email))
      newErrors.Email = "Email is required";
    else if (!validator.isEmail(form.Email))
      newErrors.Email = "Invalid email";

    if (validator.isEmpty(form.Password))
      newErrors.Password = "Password is required";
    else if (!validator.isLength(form.Password, { min: 8 }))
      newErrors.Password = "Min 8 characters";

    if (!form.VilleId)
      newErrors.VilleId = "Choose a city";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(AddUser(form));
  };

  const inputClass =
    "w-full p-3 rounded-lg border outline-none transition-colors " +
    "border-amber-400 dark:border-amber-500/60 " +
    "bg-white dark:bg-slate-800/80 " +
    "text-slate-800 dark:text-slate-100 " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
    "focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500";

  return (
    <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900
                   border border-transparent dark:border-slate-700/60
                   p-8 rounded-2xl shadow-xl dark:shadow-black/40
                   w-full max-w-md
                   transition-colors duration-300"
      >
        {/* heading */}
        <h2 className="text-2xl font-bold mb-1 text-center text-amber-500 dark:text-amber-400
                       font-['Playfair_Display']">
          Sign Up
        </h2>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-7">
          Create your account to get started
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <input
            type="text"
            name="FullName"
            placeholder="Full Name"
            onChange={handleChange}
            className={inputClass}
          />
          {errors.FullName && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
              {errors.FullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="Email"
            placeholder="Email"
            onChange={handleChange}
            className={inputClass}
          />
          {errors.Email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
              {errors.Email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            name="Password"
            placeholder="Password"
            onChange={handleChange}
            className={inputClass}
          />
          {errors.Password && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
              {errors.Password}
            </p>
          )}
        </div>

        {/* City */}
        <div className="mb-6">
          <select
            name="VilleId"
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Choose a city</option>
            {villes.map((v) => (
              <option key={v._id} value={v._id}>
                {v.ville}
              </option>
            ))}
          </select>
          {errors.VilleId && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
              {errors.VilleId}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full cursor-pointer py-3 rounded-lg font-semibold
                     bg-amber-500 hover:bg-amber-600
                     dark:bg-amber-500 dark:hover:bg-amber-400
                     text-white transition-colors duration-200
                     shadow-md hover:shadow-lg"
        >
          Sign Up
        </button>

        {/* Divider hint */}
        <p className="mt-5 text-center text-sm text-slate-400 dark:text-slate-500">
          Already have an account?{" "}
          <span onClick={()=>{dispatch(SetLoginForm())}} className="text-amber-500 dark:text-amber-400 font-medium cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}