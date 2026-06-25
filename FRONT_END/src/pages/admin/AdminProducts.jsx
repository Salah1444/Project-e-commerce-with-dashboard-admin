import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, deleteProductThunk } from "@/store/productsSlice"
import { handleEditClick, handleSheetOpenChange, handleAddClick, setSearchQuery } from "@/store/productsSlice"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Tag, Layers, Search, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import AddProductForm from "@/components/AddProductForm"
import { toast } from "react-toastify"
import Loading from "@/components/Loading"
import { useNavigate } from "react-router-dom"

export default function AdminProducts() {
  const dispatch = useDispatch()
  const {  loading } = useSelector((state) => state.products)
  const products = useSelector(st => st.products.allProducts);
  const categories = useSelector(st=>st.category.category)
  const { searchQuery, isSheetOpen, editingProduct,error } = useSelector((state) => state.products)
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchProducts())
  }, [])
  
  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProductThunk(productId));
    }
  };

const getCategoryName = (productCategory) => {
  if (!productCategory) return "Uncategorized";
  if (typeof productCategory === "object") return productCategory.name || productCategory.category;
  // it's a string ID — find it in categories
  return categories.find(c => c._id === productCategory)?.category || "Uncategorized";
};
  const filteredProducts = products.filter((product) => {
    
    const categoryName = product?.category?.name|| "Uncategorized";
    return product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const onSheetOpenChange = (open) => {
    dispatch(handleSheetOpenChange(open));
  };
  const onAddClick = () => {
    dispatch(handleAddClick());
  };
  
  if(loading){
    return <Loading/>
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products Management</h2>
          <p className="text-muted-foreground">Manage your store's inventory and catalog.</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
          <Button onClick={onAddClick} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>{editingProduct ? "Update Product" : "Add New Product"}</SheetTitle>
              <SheetDescription>
                {editingProduct 
                  ? "Update the details of this product below." 
                  : "Fill in the details below to add a new product to your store."}
              </SheetDescription>
            </SheetHeader>
            <AddProductForm 
              onSuccess={() => dispatch(handleSheetOpenChange(false))} 
              product={editingProduct} 
            />
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">All Products</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 bg-muted/50 border-border/50 h-9"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {products.length === 0 ? "No products found." : "No products match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border overflow-hidden">
                        {product.image ? (
                          <img src={`http://localhost:5000/uploads/products/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Tag className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Layers className="mr-1 h-3 w-3" />
                        {getCategoryName(product?.category)}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">${product.price}</TableCell>
                    <TableCell>{product.rating ? "⭐".repeat(Math.round(product.rating)) : "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.stock > 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-blue-500 hover:text-blue-600"
                          onClick={() => dispatch(handleEditClick(product))}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                        <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-gray-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => navigate(`details`,{state:{id:product._id}})}
                        >
                        <Eye className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
