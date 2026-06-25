import { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Bell, Package, Mail } from "lucide-react";

const ICONS = {
  new_order: Bell,
  low_stock: Package,
  contact_message: Mail,
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">All notifications for your account.</p>
        </div>
        <div>
          <Button variant="ghost" onClick={markAllAsRead} className="flex items-center gap-2">
            <Check size={16} /> Mark all as read
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <div key={n._id} className={`flex items-start gap-4 p-4 ${!n.read ? "bg-amber-50/50 dark:bg-amber-950/10" : ""}`}>
                    <div className="h-10 w-10 rounded-md flex items-center justify-center bg-muted">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{n.message}</p>
                        <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {!n.read && (
                          <Button size="sm" onClick={() => markAsRead(n._id)} className="h-8">
                            Mark read
                          </Button>
                        )}
                        {n.url && (
                          <a href={n.url} className="text-sm text-amber-500 hover:underline">Open</a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
