import { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Package, Mail } from "lucide-react";

const ICONS = {
  new_order: Bell,
  low_stock: Package,
  contact_message: Mail,
};

export default function Notifications() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Your recent notifications</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent</CardTitle>
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
                        <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
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
