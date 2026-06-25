import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategoryThunk, deleteCategoryThunk } from "@/store/CategorySlice";
import { toast } from "react-toastify";
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
import { Plus, Eye, Image, Search, Trash } from "lucide-react";
import Loading from "@/components/Loading";
import { fetchProducts } from "@/store/productsSlice";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { category, loading } = useSelector((state) => state.category);
  const { allProducts } = useSelector(st => st.products);
  const [openAddSheet, setOpenAddSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredCategories = useMemo(
    () =>
      category.filter((cat) =>
        cat.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [category, searchQuery]
  );

  const handleAddCategory = async (event) => {
    event.preventDefault();

    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName.trim());
    if (newImage) {
      formData.append("image", newImage);
    }
      setSaving(true);
      dispatch(addCategoryThunk(formData));
      setNewName("");
      setNewImage(null);
      setOpenAddSheet(false);
  };
  const DaletCategory =  (id) => {
    dispatch(deleteCategoryThunk(id));
  };

  if (loading) {
    return (
      
        <Loading />
    );
  }
  return (
    
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories Management</h2>
          <p className="text-muted-foreground">
            View all categories and inspect details for each one.
          </p>
        </div>

        <Sheet open={openAddSheet} onOpenChange={setOpenAddSheet}>
          <Button onClick={() => setOpenAddSheet(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Add Category</SheetTitle>
              <SheetDescription>
                Create a new category with a title and optional image.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900">Name</label>
                <Input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full text-sm text-slate-700 file:rounded-md file:border file:border-slate-300 file:bg-slate-50 file:px-3 file:py-2 file:text-sm file:font-medium"
                  onChange={(event) => setNewImage(event.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Category"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-medium">All Categories</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search categories..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nbr products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {category.length === 0 ? "No categories found." : "No categories match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                        {cat.Image ? (
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/category/${cat.Image}`}
                            alt={cat.category}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Image className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cat.category}</TableCell>
                    <TableCell>{cat._id}</TableCell>
                    <TableCell><span className="font-medium text-green-600 bg-green-100 px-2 py-1 rounded">{allProducts?.filter((product) => product?.category?._id === cat._id || cat.category === 'All').length}</span></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Details
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => DaletCategory(cat._id)}>
                        <Trash className=" h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-xl font-semibold">Category Details</h3>
                <p className="text-sm text-muted-foreground">Inspect the selected category.</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                Close
              </Button>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-3xl bg-slate-100">
                {selectedCategory.Image ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/category/${selectedCategory.Image}`}
                    alt={selectedCategory.category}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[220px] items-center justify-center text-muted-foreground">
                    <Image className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Name</p>
                  <p className="mt-2 text-xl font-semibold">{selectedCategory.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Category ID</p>
                  <p className="mt-2 text-sm text-slate-700 break-all">{selectedCategory._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Number of products</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {allProducts?.filter((product) => product?.category?._id === selectedCategory._id || selectedCategory.category === 'All').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

