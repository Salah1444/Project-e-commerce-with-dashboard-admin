import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import logo from "@/assets/images/logo.svg"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings, Layers, Building } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/userSlice"
import { useEffect } from "react"
import NotificationBell from "@/pages/admin/NotificationBell"

export default function AdminLayout() {
  const location = useLocation()
  useEffect(() => {

  const title = location.pathname
    .split("/")
    .filter(Boolean)
    .join(" | ");

  document.title = title || "SalahStore";
}, [location.pathname]);
  const  me = useSelector(st=>st.user.user) || {};
  const firstName = me?.FullName?.split(' ')[0] || 'Admin'
  const dispatch = useDispatch();
  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
    { title: "Products", icon: Package, url: "/admin/products" },
    { title: "Orders", icon: ShoppingCart, url: "/admin/orders" },
    { title: "Users", icon: Users, url: "/admin/users" },
    { title: "Categories", icon: Layers, url: "/admin/category" },
    { title: "Cities", icon: Building, url: "/admin/city" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <Sidebar variant="inset" className="border-r shadow-sm">
          <SidebarHeader className="border-b px-4 py-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <img src={logo} alt="Logo" />
              </div>
              <span className="text-lg font-bold text-[#00C6FF]">Salah Dashboard</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="mb-1"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9 border border-primary/20">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-primary/10 text-primary">{me?.FullName.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{firstName}</span>
                <span className="text-xs text-muted-foreground">{me?.Email || "admin@ecostore.com"}</span>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="flex flex-col gap-1">
              <SidebarMenuButton asChild variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <Link to="/admin/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton onClick={() => dispatch(logout())} variant="ghost"  className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50">
                <LogOut   className="mr-2 h-4 w-4" />
                Logout
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger />
            <div className="flex-1 ">
              <h1 className="text-lg font-semibold capitalize">
                {location.pathname === "/admin" ? "Dashboard" : location.pathname.split("/").pop()}
              </h1>
            </div>
            <div>
              <NotificationBell />
              

            </div>
          </header>
          
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
