import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const {  loadingState } = useSelector((state) => state.admin);
  const {orders} = useSelector(st =>st.orders);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  const kpis = [
    {
      title: "Pending Orders",
      value: orders.reduce((acc, order) =>  (order.paymentStatus == "Pending") ?( acc += 1 ):acc , 0),
      icon: (
        <span className="inline-flex items-center rounded-full bg-amber-100 justify-center w-full h-full text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
          <Clock  />
        </span>
      ),
      
    },
    {
      title: "Orders Cancelled",
      value: orders.reduce((acc, order) =>  (order.paymentStatus == "Cancelled") ?( acc += 1 ):acc , 0),
      icon: (
        <span className="inline-flex items-center justify-center rounded-full bg-red-100 w-full h-full text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-500">
          <XCircle  />
        </span>
      ),
      trend: "+5.2%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Orders Completed",
      value: orders.reduce((acc, order) =>  (order.paymentStatus == "Completed") ?( acc += 1 ):acc , 0),
      icon: (
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 w-full h-full text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500">
          <CheckCircle2  />
        </span>
      ),
      trend: "In Stock",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-500">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status || "Pending"}
          </span>
        );
    }
  };
  if(loadingState){
    return <Loading/>
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card
            key={index}
            className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${kpi.bg}`}
              >
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {kpi.value}
              </div>
              
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Monitor and process customer orders.
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 bg-muted/50 border-border/50 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium font-mono text-xs">
                      {order._id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {order.user?.FullName || "Guest User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.user?.Email || order.shippingDetails?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      ${order.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.paymentStatus || order.orderStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
