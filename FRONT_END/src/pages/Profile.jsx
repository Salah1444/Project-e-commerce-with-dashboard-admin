import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProfile, updateProfile,UpdatePassword, logout } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
export default function Profile() {
  const { user,passwordUpdated } = useSelector((state) => state.user);

  const villes = useSelector((state) => state.ville.ville) || [];
  const dispatch = useDispatch();
  if(passwordUpdated){
    dispatch(logout());
    localStorage.setItem('theme', 'light')
  }
  // Profile Update Form
  const [profileForm, setProfileForm] = useState({
    FullName: user?.FullName || "",
    Email: user?.Email || "",
    VilleId: user?.VilleId || "",
  });

  // Password Update Form
  const [passwordForm, setPasswordForm] = useState({
    OldPassword: "",
    NewPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ ...profileForm, _id: user?._id }));
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if(passwordForm.NewPassword==="" || passwordForm.OldPassword===""){
      return toast.error("All Filed Are required !!!");
    }
    dispatch(UpdatePassword({...passwordForm,_id:user?._id}))
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-amber-50  to-orange-50 dark:from-slate-900 dark:to-slate-950  py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-amber-400 mb-3">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your profile information and account security. Keep your details up-to-date and secure your account with a strong password.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information Section */}
          
            <form
            onSubmit={handleProfileSubmit}
            className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100"
          >
            <div className="mb-8">
              <div className="flex items-center backdrop-blur-4xl dark:bg-transparent gap-3 mb-3">
                <div className="w-1 h-8 bg-amber-500 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900  dark:text-gray-50">
                  Profile Information
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Update your personal information including your full name, email address, and delivery city. These details are used for your orders and account communication.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm  dark:text-amber-500 font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">
                Your complete name as you'd like it to appear on orders
              </p>
              <Input
                type="text"
                name="FullName"
                value={profileForm.FullName}
                placeholder="John Doe"
                onChange={handleProfileChange}
                className="border-amber-300  rounded-xl dark:text-white focus:ring-amber-400 focus:border-amber-400"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm  dark:text-amber-500 font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">
                Your email is used for account recovery and notifications
              </p>
              <Input
                type="email"
                name="Email"
                value={profileForm.Email}
                placeholder="you@example.com"
                onChange={handleProfileChange}
                className="border-amber-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-amber-400 focus:border-amber-400"
              />
            </div>

            <div className="mb-7">
              <label className="block text-sm dark:text-amber-500 font-semibold text-gray-800 mb-2">
                Delivery City
              </label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">
                Select your city for accurate shipping and delivery
              </p>
              <select
                name="VilleId"
                value={profileForm.VilleId}
                onChange={handleProfileChange}
className="w-full px-4 py-2 border border-amber-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-gray-800 dark:text-white"              >
                <option value="">Choose a city</option>
                {villes.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.ville}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Save Profile Changes
            </Button>
          </form>
          

          {/* Password Update Section */}
            <form
            onSubmit={handlePasswordSubmit}
            className=" p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-red-100"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-red-500 rounded"></div>
                <h2 className="text-2xl  font-bold text-gray-900 dark:text-gray-50">
                  Security
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Change your password regularly to keep your account secure. Use a strong password with a mix of letters, numbers, and symbols for better security.
              </p>
            </div>

            <div className="mb-5 p-4 bg-red-50 dark:bg-transparent rounded-lg border border-red-200">
              <p className="text-xs text-red-700 dark:text-red-500 font-medium">
                ⚠️ Password Tips:
              </p>
              <ul className="text-xs text-red-500 mt-2 space-y-1 list-disc list-inside">
                <li>Use at least 8 characters</li>
                <li>Mix uppercase, lowercase, numbers & symbols</li>
                <li>Avoid using personal information</li>
              </ul>
            </div>

            <div className="mb-5">
              <label className="block dark:text-amber-400 text-sm font-semibold text-gray-800 mb-2">
                Current Password
              </label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">
                Enter your current password to verify it's you
              </p>
              <Input
                type="password"
                name="OldPassword"
                value={passwordForm.OldPassword}
                placeholder="••••••••"
                onChange={handlePasswordChange}
                className="border-red-300 rounded-xl focus:ring-red-400 focus:border-red-400"
              />
            </div>

            <div className="mb-7">
              <label className="block dark:text-amber-400 text-sm font-semibold text-gray-800 mb-2">
                New Password
              </label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">
                Create a strong, unique password for your account
              </p>
              <Input
                type="password"
                name="NewPassword"
                value={passwordForm.NewPassword}
                placeholder="••••••••"
                onChange={handlePasswordChange}
                className="border-red-300  focus:ring-red-400 focus:border-red-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Update Password
            </Button>
          </form>
          
        </div>

        {/* Footer Info */}
        <div className="mt-12 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              <span className="font-semibold text-gray-800 dark:text-amber-400">Need help?</span> If you experience any issues with your account or password, please contact our support team. We're here to help you keep your account secure and up-to-date.
            </p>
          </div>

          {/* Delete Account Section */}
          <div className="bg-red-50 dark:bg-transparent p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-600 mb-1">
                  ⚠️ Delete Account
                </p>
                <p className="text-sm text-red-700">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={() => {
                  if (window.confirm("Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.")) {
                     dispatch(deleteProfile(user?._id));
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
