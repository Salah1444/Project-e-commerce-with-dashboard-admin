import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator"
import { AddUser } from "@/store/userSlice";
import { fetchVille } from "@/store/villeSlice";
export default function RegisterAdmin() {
  useEffect(()=>{
    dispatch(fetchVille());
  },[])
  const villes = useSelector((st) => st.ville.ville);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  
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
    if (validator.isEmpty(form.FullName)) {
      newErrors.FullName = "Full name is required";
    }

    if (validator.isEmpty(form.Email)) {
      newErrors.Email = "Email is required";
    } else if (!validator.isEmail(form.Email)) {
      newErrors.Email = "Invalid email";
    }

    if (validator.isEmpty(form.Password)) {
      newErrors.Password = "Password is required";
    } else if (!validator.isLength(form.Password, { min: 8 })) {
      newErrors.Password = "Min 8 characters";
    }

    if (!form.VilleId) {
      newErrors.VilleId = "Choose a city";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(AddUser(form));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-600">
          Add Admin
        </h2>
        <input
          type="text"
          name="FullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-4 p-3 border outline-0 transition-colors border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-400"
        />
        {errors.FullName && (
          <p className="text-red-500 text-sm mb-2">{errors.FullName}</p>
        )}
        <input
          type="email"
          name="Email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-3 border  outline-0 transition-colors border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-400"
        />
        {errors.Email && (
          <p className="text-red-500 text-sm mb-2">{errors.Email}</p>
        )}
        <input
          type="password"
          name="Password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-3 border  outline-0 transition-colors border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-400"
        />
        {errors.Password && (
          <p className="text-red-500 text-sm mb-2">{errors.Password}</p>
        )}
        <select
          name="VilleId"
          onChange={handleChange}
          className="w-full mb-6 p-3 border  outline-0 transition-colors border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-400"
        >
          <option value="">Choose a city</option>
          {villes.map((v) => (
            <option key={v._id} value={v._id}>
              {v.ville}
            </option>
          ))}
        </select>
        {errors.VilleId && (
          <p className="text-red-500 text-sm mb-2">{errors.VilleId}</p>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
