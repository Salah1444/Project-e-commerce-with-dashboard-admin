import { useEffect, useState } from "react";
import {  useParams, useNavigate } from "react-router-dom";
import API from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "@/store/orderSlice";
import { toast } from "react-toastify";

// ── helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Pending:   { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",   icon: Clock,        dot: "bg-amber-400"  },
  Shipped:   { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",       icon: Truck,        dot: "bg-blue-400"   },
  Delivered: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2, dot: "bg-emerald-400" },
  Cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",           icon: Ban,          dot: "bg-red-400"    },
};

const PAYMENT_CONFIG = {
  Paid:      { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  Pending:   { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"   },
  Cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"           },
  Refunded:  { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
};

const Badge = ({ label, config }) => {
  const Icon = config?.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config?.color ?? "bg-muted text-muted-foreground"}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
    <span className="text-sm font-medium">{value ?? "—"}</span>
  </div>
);

// ── component ──────────────────────────────────────────────────────────────

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const {order,loadingOrder,errorOrder} = useSelector(st =>st.orders);
  useEffect(() => {
    dispatch(getOrderById(id))
  }, [id]);
  const updateStatus = async (payload) => {
    setUpdating(true);
    
    try {
     const  res= await API.put(`/orders/${id}`,payload);
      order.orderStatus = payload;
      res.data.success && toast.success(res.data.message)
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Package className="h-5 w-5 mr-2 animate-pulse" />
        Loading order...
      </div>
    );
  }
  if(errorOrder){
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <XCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{errorOrder}</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <XCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    );
  }

  const isCancelled = order?.orderStatus === "Cancelled";
  const isShipped   = order?.orderStatus === "Shipped" || order?.orderStatus === "Delivered";
  const subtotal    = order?.cartItems?.reduce((s, it) => s + it.price * it.quantity, 0) ?? 0;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              order <span className="text-primary">#{order?._id?.substring(0, 8).toUpperCase()}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed by{" "}
              <span className="font-medium text-foreground">
                {order?.user?.FullName || "Guest"}
              </span>{" "}
              ·{" "}
              {new Date(order?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={order?.orderStatus}   config={STATUS_CONFIG[order?.orderStatus]}   />
          <Badge label={order?.paymentStatus} config={PAYMENT_CONFIG[order?.paymentStatus]} />
        </div>
      </div>

      {/* ── Action buttons ── */}
      {!isCancelled && (
        <div className="flex items-center gap-2 flex-wrap">
          {!isShipped && (
            <Button
              disabled={updating}
              onClick={() => updateStatus({ orderStatus: "Shipped" })}
              className="gap-2"
            >
              <Truck className="h-4 w-4" />
              Mark as Shipped
            </Button>
          )}
          {order?.orderStatus === "Shipped" && (
            <Button
              disabled={updating}
              onClick={() => updateStatus({ orderStatus: "Delivered" })}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Delivered
            </Button>
          )}
          <Button
            variant="destructive"
            disabled={updating}
            onClick={() => updateStatus({ orderStatus: "Cancelled", paymentStatus: "Cancelled" })}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancel Order
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Shipping info ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow
                label="Full Name"
                value={`${order?.shippingDetails?.firstName} ${order?.shippingDetails?.lastName}`}
              />
              <InfoRow label="City / ZIP" value={`${order?.shippingDetails?.city} — ${order?.shippingDetails?.zip}`} />
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{order?.shippingDetails?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{order?.shippingDetails?.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* ── Order items ── */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Items ({order?.cartItems?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-border/50">
              {order?.cartItems?.map((it) => (
                <div
                  key={it._id || it.product}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  {/* Product image or placeholder */}
                  <div className="h-14 w-14 rounded-lg bg-muted border border-border/50 overflow-hidden shrink-0 flex items-center justify-center">
                    {it.product?.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${it.product.image}`}
                        alt={it.product?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {it.product?.name || it.product}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {it.quantity} × ${it.price?.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-semibold text-sm shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: payment summary ── */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <InfoRow label="Method"         value={order?.paymentMethod} />
              <InfoRow label="Payment Status" value={
                <Badge label={order?.paymentStatus} config={PAYMENT_CONFIG[order?.paymentStatus]} />
              } />
              <InfoRow label="orderStatus"   value={
                <Badge label={order?.orderStatus} config={STATUS_CONFIG[order?.orderStatus]} />
              } />

              <div className="border-t border-border/50 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1 border-t border-border/50">
                  <span>Total</span>
                  <span className="text-primary">${order?.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}