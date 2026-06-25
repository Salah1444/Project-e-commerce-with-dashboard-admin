import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import API from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    const fetch = async () => {
      try {
        // Try fetching all orders and find one (no single order endpoint exists)
        const res = await API.get("/admin/orders");
        const found = (res.data.orders || []).find((o) => o._id === id);
        if (found) setOrder(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order #{order._id.substring(0,8).toUpperCase()}</h1>
        <p className="text-sm text-muted-foreground">Total: ${order.totalAmount?.toFixed(2)}</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</div>
          <div className="text-sm text-muted-foreground">{order.shippingDetails.email}</div>
          <div className="text-sm">{order.shippingDetails.phone}</div>
          <div className="text-sm">{order.shippingDetails.city} - {order.shippingDetails.zip}</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.cartItems.map((it) => (
              <div key={it._id || it.product} className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md" />
                <div className="flex-1">
                  <div className="font-medium">{it.product?.name || it.product}</div>
                  <div className="text-sm text-muted-foreground">Qty: {it.quantity} × ${it.price?.toFixed(2)}</div>
                </div>
                <div className="font-medium">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
