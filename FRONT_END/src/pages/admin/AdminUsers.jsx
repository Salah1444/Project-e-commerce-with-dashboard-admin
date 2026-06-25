import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/store/userSlice";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  ShieldCheck, User, MapPin, ShoppingCart, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button"
import {  useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

export default function AdminUsers() {
  const  navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.usersLoading);
  const error = useSelector((state) => state.user.usersError);
  const { ville } = useSelector((state) => state.ville);
  useEffect(()=>{
    dispatch(fetchUsers());
  },[])
  
  const  getVilleName = (user)=>{
   let villeName = ville?.map(it=>{
    if(it._id == user.VilleId){
      return it.ville;
    }
   } )
    return villeName;
  }
  const  onAddClick = ()=>{
   navigate('../addAdmin');
  }
  if(loading){
    return <Loading />
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
        <p className="text-muted-foreground">
          View all registered customers on your store.
        </p>
        </div>
        <Button  onClick={onAddClick} className="w-full bg-amber-500 cursor-pointer sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.is_admin).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="text-2xl font-bold text-emerald-600">
              {users.filter((u) => !u.is_admin).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">All Users</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-center">Cart</TableHead>
                <TableHead className="text-center">Favorites</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {users.length === 0 ? "No users found." : "No users match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                 users.map((user) => (
                  <TableRow key={user._id}>
                    {/* Name */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium border">
                          {user.FullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.FullName}</span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-muted-foreground text-sm">
                      {user.Email}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          <ShieldCheck className="h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <User className="h-3 w-3" />
                          Customer
                        </span>
                      )}
                    </TableCell>

                    {/* City */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {getVilleName(user)}
                      </div>
                    </TableCell>

                    {/* Cart count */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                        {user.Cart?.length ?? 0}
                      </div>
                    </TableCell>

                    {/* Favorites count */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Heart className="h-3 w-3 text-muted-foreground" />
                        {user.Favorite?.length ?? 0}
                      </div>
                    </TableCell>

                    {/* Join date */}
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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