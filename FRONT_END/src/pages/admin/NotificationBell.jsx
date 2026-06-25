import { useState, useEffect, useRef } from "react";
import { Bell, Package, ShoppingCart, Mail, Check } from "lucide-react";
import { useSelector } from "react-redux";
import API from "@/services/api";
import { socket } from "@/lib/socket";

const ICONS = {
  new_order: ShoppingCart,
  low_stock: Package,
  contact_message: Mail,
};

const COLORS = {
  new_order: "text-green-500 bg-green-50 dark:bg-green-950/40",
  low_stock: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  contact_message: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
};

export default function NotificationBell() {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Charger les notifications
  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    console.log(res);
    setNotifications(res.data.data);
  };

  const fetchUnreadCount = async () => {
    const res = await API.get("/notifications/unread-count");
    setUnreadCount(res.data.count);
  };

  // Init + Socket.io temps réel
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    if (user?._id) {
      socket.emit("join", user._id);

      socket.on("new_notification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => socket.off("new_notification");
  }, [user]);

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    await API.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await API.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} j`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Bell size={20} className="text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-white text-xs px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1"
              >
                <Check size={14} /> Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              Aucune notification
            </p>
          ) : (
            notifications.map((notif) => {
              const Icon = ICONS[notif.type] || Bell;
              return (
                <a
                  key={notif._id}
                  href={notif.url || "#"}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif._id);
                  }}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    !notif.read ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${COLORS[notif.type] || ""}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.read && (
                    <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  )}
                </a>
              );
            })
          )}

          <a
            href="/admin/notifications"
            className="block text-center text-sm text-amber-500 hover:text-amber-600 py-3 border-t border-gray-100 dark:border-gray-800"
          >
            Voir toutes les notifications
          </a>
        </div>
      )}
    </div>
  );
}
