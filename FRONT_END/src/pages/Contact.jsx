import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

// Classes réutilisables
const inputClass = (error) =>
  `block w-full rounded-md px-3.5 py-2 text-base
   bg-white dark:bg-slate-800
   text-amber-950 dark:text-slate-100
   outline-1 -outline-offset-1
   placeholder:text-gray-400 dark:placeholder:text-slate-500
   focus:outline-2 focus:-outline-offset-2
   transition-colors duration-200
   ${error
     ? "outline-red-400 focus:outline-red-500"
     : "outline-gray-300 dark:outline-slate-600 focus:outline-amber-400"
   }`;

const labelClass =
  "block text-sm font-semibold text-gray-900 dark:text-slate-200 mb-1";

const errorClass =
  "text-red-500 dark:text-red-400 text-xs mt-1 ml-1";

export default function Contact() {
  const [errors, setErrors] = useState({});
  const [user,   setUser]   = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = { ...user, [name]: type === "checkbox" ? checked : value };
    setUser(newData);
    setErrors(validate(newData));
  };

  const validate = (data) => {
    const errs = {};

    if (!data.firstName?.trim())
      errs.firstName = "First name is required";

    if (!data.lastName?.trim())
      errs.lastName = "Last name is required";

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
      errs.email = "Valid email is required";

    // ✅ Fix : vérifier que phone existe ET est un nombre valide
    if (!data.phone?.trim() || isNaN(data.phone) || data.phone.trim().length < 10)
      errs.phone = "Valid phone number is required";

    if (!data.message || data.message.trim().length < 100)
      errs.message = "Message must be at least 100 characters";

    if (!data["agree-to-policies"])
      errs["agree-to-policies"] = "You must agree to the policy";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(user);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/message/send`,
          user
        );
        res.data.success
          ? toast.success(res.data.message)
          : toast.error(res.data.message);
      } catch (err) {
        toast.error("Une erreur est survenue, réessayez.");
        console.error(err);
      }
      e.target.reset();
      setUser({});
      setErrors({});
    }
  };

  const isFormEmpty  = Object.keys(user).length === 0;
  const hasErrors    = Object.keys(errors).length > 0;
  const isDisabled   = isFormEmpty || hasErrors;

  return (
    <div className="isolate bg-white dark:bg-slate-900
                    px-6 py-24 sm:py-32 lg:px-8
                    transition-colors duration-300 min-h-screen">

      {/* Blob décoratif */}
      <div aria-hidden="true"
           className="absolute inset-x-0 -top-40 -z-10
                      transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem]
                     -translate-x-1/2 rotate-[30deg]
                     bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
                     opacity-20 dark:opacity-10
                     sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Titre */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight
                       text-amber-950 dark:text-amber-400 sm:text-5xl">
          Contact
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-slate-400">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

          {/* First name */}
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <input
              id="firstName" name="firstName" type="text"
              autoComplete="given-name"
              onChange={onChange}
              className={inputClass(errors.firstName)}
            />
            {errors.firstName &&
              <span className={errorClass}>{errors.firstName}</span>}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <input
              id="lastName" name="lastName" type="text"
              autoComplete="family-name"
              onChange={onChange}
              className={inputClass(errors.lastName)}
            />
            {errors.lastName &&
              <span className={errorClass}>{errors.lastName}</span>}
          </div>

          {/* Company */}
          <div className="sm:col-span-2">
            <label htmlFor="company" className={labelClass}>
              Company <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="company" name="company" type="text"
              autoComplete="organization"
              onChange={onChange}
              className={inputClass(false)}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email" name="email" type="email"
              autoComplete="email"
              onChange={onChange}
              className={inputClass(errors.email)}
            />
            {errors.email &&
              <span className={errorClass}>{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label htmlFor="phone" className={labelClass}>Phone number</label>
            <input
              id="phone" name="phone" type="text"
              placeholder="0612345678"
              onChange={onChange}
              className={inputClass(errors.phone)}
            />
            {errors.phone &&
              <span className={errorClass}>
                {errors.phone} — {user.phone?.length ?? 0}/10 chiffres
              </span>}
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label htmlFor="message" className={labelClass}>
              Message
              <span className={`ml-2 text-xs font-normal
                ${(user.message?.length ?? 0) >= 100
                  ? "text-green-500"
                  : "text-gray-400 dark:text-slate-500"}`}>
                {user.message?.length ?? 0} / 100 min
              </span>
            </label>
            <textarea
              id="message" name="message" rows={4}
              onChange={onChange}
              className={inputClass(errors.message)}
              defaultValue=""
            />
            {errors.message &&
              <span className={errorClass}>
                {/* ✅ Fix parenthèses */}
                {errors.message} — {(user.message?.length ?? 0)}/100
              </span>}
          </div>

          {/* Toggle politique */}
          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <div className="group relative inline-flex w-8 shrink-0 rounded-full
                              bg-gray-200 dark:bg-slate-700 p-px
                              inset-ring inset-ring-gray-900/5
                              outline-offset-2 outline-amber-600
                              transition-colors duration-200 ease-in-out
                              has-checked:bg-amber-500">
                <span className="size-4 rounded-full bg-white shadow-xs
                                 ring-1 ring-gray-900/5
                                 transition-transform duration-200 ease-in-out
                                 group-has-checked:translate-x-3.5" />
                <input
                  id="agree-to-policies"
                  name="agree-to-policies"
                  type="checkbox"
                  onChange={onChange}
                  aria-label="Agree to policies"
                  className="absolute inset-0 size-full appearance-none focus:outline-hidden"
                />
              </div>
            </div>
            <label htmlFor="agree-to-policies"
                   className="text-sm text-gray-600 dark:text-slate-400">
              By selecting this, you agree to our{" "}
              <a href="#"
                 className="font-semibold text-amber-600 dark:text-amber-400
                            hover:text-amber-500 underline underline-offset-2">
                privacy policy
              </a>.
            </label>
          </div>

          {errors["agree-to-policies"] && (
            <span className={`${errorClass} sm:col-span-2`}>
              {errors["agree-to-policies"]}
            </span>
          )}

        </div>

        {/* Submit */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={isDisabled}
            className="block w-full rounded-md px-3.5 py-2.5
                       text-center text-sm font-semibold text-white
                       bg-amber-600 hover:bg-amber-500
                       disabled:bg-gray-400 dark:disabled:bg-slate-700
                       disabled:cursor-not-allowed cursor-pointer
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-amber-600
                       transition-colors duration-200 shadow-sm"
          >
            Send message
          </button>
        </div>
      </form>
    </div>
  );
}