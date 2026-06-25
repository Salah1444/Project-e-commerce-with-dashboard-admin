import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { fetchStats } from "@/store/adminSlice";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AddProductForm from "@/components/AddProductForm";
import ChartOrders from "@/components/ChartOrders";
import UsersChart from "@/components/usersChart";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);
  
  const data = [
  { month: "Jan", orders: 0 },
  { month: "Feb", orders: 0 },
  { month: "Mar", orders: 0 },
  { month: "Apr", orders: 0 },
  { month: "May", orders: 0 },
  { month: "Jun", orders: 0 },
  { month: "Jul", orders: 0 },
  { month: "Aug", orders: 0 },
  { month: "Sep", orders: 0 },
  { month: "Oct", orders: 0 },
  { month: "Nov", orders: 0 },
  { month: "Dec", orders: 0 },
];

 
// copier data pour ne pas muter l'original
const chartData = [...data];

// map pour accès rapide
const monthMap = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

stats?.orders?.forEach((order) => {
  const date = new Date(order.createdAt);

  const month = date.toLocaleString("en-US", {
    month: "short",
  });

  if (monthMap[month] !== undefined) {
    chartData[monthMap[month]].orders += 1;
  }
});

const usersByVilleMap = {};
stats?.users?.forEach((user) => {
  if(user?.is_admin ){
    return;
  }
  const villeName = user?.VilleId?.ville || "Unknown";
   
  if (!usersByVilleMap[villeName] ) {
    usersByVilleMap[villeName] = 0;
  }
  usersByVilleMap[villeName] += 1;
});

const usersChartData = Object.keys(usersByVilleMap).map((ville) => ({
  ville,
  users: usersByVilleMap[ville],
}));

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive font-medium">Error: {error}</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue?.toLocaleString() || "0.00"}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      trend: "+5.2%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Products",
      value: stats.totalProducts?.toString() || "0",
      icon: Package,
      trend: "In Stock",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total Customers",
      value: stats.totalUsers?.toString() || "0",
      icon: Users,
      trend: "+18.1%",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {kpi.value}
              </div>
              <p className="mt-1 flex items-center text-xs font-medium text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                {kpi.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity Overview</CardTitle>
            <CardDescription>
              New orders and users in the last 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-amber-500 mb-2">
                  {stats.last24hOrders || 0}
                </p>
                <p  className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  New Orders
                </p>
              </div>
              <div className="h-16 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-500 mb-2">
                  {stats.newUsers || 0}
                </p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  New Users
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Store activity is looking great today!
            </div>
          </CardContent>
        </Card>

        {/* This could be a list of recent orders or top products */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setIsSheetOpen(true)}
            >
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Add New Product</p>
                <p className="text-xs text-muted-foreground">
                  Expand your catalog
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div onClick={()=>navigate('/admin/orders')}>
                <p className="font-medium">View Pending Orders</p>
                <p className="text-xs text-muted-foreground">
                  Process customer purchases
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="bg-emerald-500/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <div onClick={()=>navigate('/admin/users')}>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">
                  View customer profiles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.lowStockProducts?.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products with fewer than 5 units remaining.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {stats.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{product.name || product.title || "Unnamed product"}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  <p className="text-sm font-semibold text-amber-600">${product.price?.toFixed(2) || "0.00"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new product to your store.
            </SheetDescription>
          </SheetHeader>
          <AddProductForm onSuccess={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Total orders in month</CardTitle>
            <CardDescription>Orders in the last 12 Months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartOrders data={chartData} />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>Customers by City.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersChart data={usersChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
