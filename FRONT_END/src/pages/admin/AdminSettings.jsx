import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDarkMode } from "@/hooks/use-darkMode";
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  Upload,
  AlertTriangle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@headlessui/react";
import { useState } from "react";

export default function AdminSettings() {
  const [dark, setDark] = useDarkMode();

  // Store Name
  const [storeName, setStoreName] = useState("Salah Store");

  // Branding
  const [logoPreview, setLogoPreview] = useState(null);
  const [accentColor, setAccentColor] = useState("#f59e0b");

  // Contact Info
  const [contact, setContact] = useState({
    email: "contact@salahstore.com",
    phone: "+212 6 00 00 00 00",
    address: "Agadir, Maroc",
  });

  // Currency & Tax
  const [currency, setCurrency] = useState("MAD");
  const [taxRate, setTaxRate] = useState(20);

  // Notifications
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newReview: false,
  });

  // Maintenance Mode
  const [maintenance, setMaintenance] = useState(false);

  // Password
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleStoreNameUpdate = () => {
    console.log("Updating store name to:", storeName);
  };

  const handleBrandingUpdate = () => {
    console.log("Updating branding:", { logoPreview, accentColor });
  };

  const handleContactUpdate = () => {
    console.log("Updating contact info:", contact);
  };

  const handleCurrencyUpdate = () => {
    console.log("Updating currency/tax:", { currency, taxRate });
  };

  const handleNotificationsUpdate = () => {
    console.log("Updating notifications:", notifications);
  };

  const handleMaintenanceToggle = () => {
    setMaintenance(!maintenance);
    console.log("Maintenance mode:", !maintenance);
  };

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("Updating password...");
  };

  // Shared input styles
  const inputClass =
    "w-full outline-1 outline-amber-400 rounded-sm px-4 py-2 dark:text-white focus:ring-amber-400 focus:border-amber-400";
  const labelClass =
    "text-sm dark:text-amber-500 font-semibold text-gray-800 mb-2 block";
  const updateBtnClass =
    "bg-amber-400 dark:text-white px-6 py-3 rounded-xl shadow-sm hover:bg-amber-500 transition-all duration-300 hover:scale-105";

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-muted-foreground">

          {/* Theme Toggle */}
          <Card className="shadow-lg flex-row justify-between items-center rounded-xl py-5 px-7">
            <div>
              <CardTitle>Theme</CardTitle>
              <span className="dark:text-gray-500 text-gray-600">
                Switch your theme to have a better visualisation
              </span>
            </div>
            <div>
              <label className="relative bg-transparent inline-flex bg-background cursor-pointer">
                <input
                  type="checkbox"
                  checked={dark}
                  onChange={() => setDark(!dark)}
                  className="peer sr-only"
                />
                <div className="h-10 w-24 rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-slate-900" />
                <div
                  className="
                    absolute left-1 top-1
                    flex h-8 w-8 items-center justify-center
                    rounded-full bg-background shadow-md
                    transition-all duration-300
                    peer-checked:translate-x-14
                  "
                >
                  {dark ? <Moon size={16} /> : <Sun size={16} />}
                </div>
              </label>
            </div>
          </Card>

          {/* Maintenance Mode banner */}
          {maintenance && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-5 py-3 text-red-700 dark:text-red-400">
              <AlertTriangle size={18} />
              <span>
                Your store is currently in <strong>maintenance mode</strong> —
                customers cannot place orders.
              </span>
            </div>
          )}

          {/* Settings Accordion */}
          <Accordion type="single" collapsible defaultValue="shipping" className="max-w-full">

            {/* Store Name */}
            <AccordionItem value="shipping">
              <AccordionTrigger>Store Name</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-3 px-6">
                  <p>
                    The name of your store is one of the most important
                    elements to attract customers.
                  </p>

                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label htmlFor="storeName" className={labelClass}>
                        Store Name
                      </label>
                      <Input
                        id="storeName"
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Salah Store"
                        className={inputClass}
                      />
                    </div>
                    <button onClick={handleStoreNameUpdate} className={updateBtnClass}>
                      Update
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Store Branding */}
            <AccordionItem value="branding">
              <AccordionTrigger>Store Branding</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-4 px-6">
                  <p>
                    Your logo and accent color appear across the storefront,
                    invoices, and emails sent to customers.
                  </p>

                  {/* Logo upload */}
                  <div>
                    <label className={labelClass}>Store Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl border border-dashed border-amber-400 flex items-center justify-center overflow-hidden bg-background">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Store logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload size={20} className="text-amber-400" />
                        )}
                      </div>
                      <label className="cursor-pointer text-amber-500 hover:text-amber-600 font-semibold">
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Accent color */}
                  <div>
                    <label htmlFor="accentColor" className={labelClass}>
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="accentColor"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-10 w-14 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <span className="dark:text-gray-400">{accentColor}</span>
                    </div>
                  </div>

                  <button onClick={handleBrandingUpdate} className={updateBtnClass}>
                    Update Branding
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Information */}
            <AccordionItem value="contact">
              <AccordionTrigger>Contact Information</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-4 px-6">
                  <p>
                    This information is displayed to customers on your
                    storefront and order confirmation emails.
                  </p>

                  <div>
                    <label htmlFor="contactEmail" className={labelClass}>
                      Support Email
                    </label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact({ ...contact, email: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className={labelClass}>
                      Phone Number
                    </label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact({ ...contact, phone: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactAddress" className={labelClass}>
                      Store Address
                    </label>
                    <Input
                      id="contactAddress"
                      type="text"
                      value={contact.address}
                      onChange={(e) =>
                        setContact({ ...contact, address: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>

                  <button onClick={handleContactUpdate} className={updateBtnClass}>
                    Update Contact Info
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Currency & Tax */}
            <AccordionItem value="currency">
              <AccordionTrigger>Currency & Tax</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-4 px-6">
                  <p>
                    Set the currency shown to customers and the tax rate
                    applied at checkout.
                  </p>

                  <div>
                    <label htmlFor="currency" className={labelClass}>
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className={inputClass}
                    >
                      <option value="MAD">MAD — Moroccan Dirham</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="USD">USD — US Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="taxRate" className={labelClass}>
                      Tax Rate (%)
                    </label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  <button onClick={handleCurrencyUpdate} className={updateBtnClass}>
                    Update Currency & Tax
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Notifications */}
            <AccordionItem value="notifications">
              <AccordionTrigger>Email Notifications</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-4 px-6">
                  <p>
                    Choose which events send you an email notification.
                  </p>

                  {[
                    { key: "newOrder", label: "New order placed" },
                    { key: "lowStock", label: "Product stock running low" },
                    { key: "newReview", label: "New customer review" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            [key]: !notifications[key],
                          })
                        }
                        className="h-5 w-5 accent-amber-400 cursor-pointer"
                      />
                    </label>
                  ))}

                  <button onClick={handleNotificationsUpdate} className={updateBtnClass}>
                    Save Preferences
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Maintenance Mode */}
            <AccordionItem value="maintenance">
              <AccordionTrigger>Maintenance Mode</AccordionTrigger>
              <AccordionContent>
                <div className="mb-5 space-y-3 px-6">
                  <p>
                    When enabled, customers see a maintenance page instead of
                    your storefront. Admin access remains available.
                  </p>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      Enable Maintenance Mode
                    </span>
                    <input
                      type="checkbox"
                      checked={maintenance}
                      onChange={handleMaintenanceToggle}
                      className="h-5 w-5 accent-red-500 cursor-pointer"
                    />
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Update Password */}
            <AccordionItem value="password">
              <AccordionTrigger>Update Password</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-6 mb-5">
                  <p>
                    Update your password regularly to keep your account secure.
                  </p>

                  <div>
                    <label htmlFor="currentPassword" className={labelClass}>
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({ ...passwords, current: e.target.value })
                        }
                        placeholder="••••••••"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className={labelClass}>
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>

                  <button onClick={handlePasswordUpdate} className={updateBtnClass}>
                    Update Password
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}