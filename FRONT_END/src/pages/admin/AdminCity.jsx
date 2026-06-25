import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVille, AddVille, DeleteVille } from "@/store/villeSlice";
import { fetchUsers } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Search, Trash, Building } from "lucide-react";
import Loading from "@/components/Loading";

export default function AdminCity() {
    const dispatch = useDispatch();
    const { ville, loading } = useSelector((state) => state.ville);
    const { users } = useSelector((state) => state.user);
    const loading2 = useSelector((state) => state.user.loading) || false;
    const [openAddSheet, setOpenAddSheet] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newCityName, setNewCityName] = useState("");
    const [newZIP, setNewZIP] = useState("");

    useEffect(() => {
        dispatch(fetchVille());
        dispatch(fetchUsers());
    }, [dispatch]);

    const filteredCities = useMemo(() => {
        if (!Array.isArray(ville)) return [];
        return ville.filter((v) =>
            v?.ville?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [ville, searchQuery]);

    const handleAddCity = async (event) => {
        event.preventDefault();

        if (!newCityName.trim()) {
            return;
        }
        dispatch(AddVille({ ville: newCityName.trim(), ZIP: newZIP.trim() })).unwrap();
        setNewCityName("");
        setNewZIP("");
        setOpenAddSheet(false);
        dispatch(fetchVille());
    };

    const handleDeleteCity = async (id) => {
            dispatch(DeleteVille(id)).unwrap();
            dispatch(fetchVille());
        
    };
    if(loading || loading2){
        return <Loading/>
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Cities Management</h2>
                    <p className="text-muted-foreground">
                        Manage supported cities for shipping and operations.
                    </p>
                </div>

                <Sheet open={openAddSheet} onOpenChange={setOpenAddSheet}>
                    <Button onClick={() => setOpenAddSheet(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add City
                    </Button>
                    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader className="mb-4">
                            <SheetTitle>Add City</SheetTitle>
                            <SheetDescription>
                                Create a new city for delivery options.
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleAddCity} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-900">City Name</label>
                                <Input
                                    value={newCityName}
                                    onChange={(event) => setNewCityName(event.target.value)}
                                    placeholder="e.g., Casablanca"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-900">ZIP Code</label>
                                <Input
                                    value={newZIP}
                                    onChange={(event) => setNewZIP(event.target.value)}
                                    placeholder="e.g., 20000"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Saving..." : "Save City"}
                            </Button>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="py-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-medium">All Cities</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search cities..."
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-16">Icon</TableHead>
                                <TableHead>City Name</TableHead>
                                <TableHead>ZIP Code</TableHead>
                                <TableHead>Customers</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           { (!ville || ville.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loading />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        {(!ville || ville.length === 0) ? "No cities found." : "No cities match your search."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCities.map((v) => (
                                    <TableRow key={v._id}>
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                                <Building className="h-5 w-5 text-primary" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{v.ville}</TableCell>
                                        <TableCell className="text-muted-foreground">{v.ZIP || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className="font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                {users?.filter((u) => u.VilleId === v._id && !u.is_admin).length || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{v._id}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(v._id)}>
                                                <Trash className="h-4 w-4" />
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