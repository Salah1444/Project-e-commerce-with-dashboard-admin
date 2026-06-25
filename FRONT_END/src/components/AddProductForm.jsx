import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProductThunk } from "@/store/productsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
export default function AddProductForm({ onSuccess, product = null }) {
  const dispatch = useDispatch();
  const { addingProduct, updatingProduct } = useSelector((state) => state.admin);
  const {category} = useSelector((state) => state.category);
  
  const isUpdate = !!product;
  const isLoading = isUpdate ? updatingProduct : addingProduct;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    rating: "",
    description: "",
    brand: "",
    warranty: "",
    sku: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category ? (product.category._id || product.category) : "",
        rating: product.rating ?? "",
        description: product.description || "",
        brand: product.brand || "",
        warranty: product.warranty || "",
        sku: product.sku || "",
      });
      if (product.image) {
         setPreview(`${import.meta.env.VITE_API_URL}/uploads/products/${product.image}`);      }
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        rating: "",
        description: "",
        brand: "",
        warranty: "",
        sku: "",
      });
      setPreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    
  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
      data.append(key, formData[key]);
    }
  });
  if (imageFile) data.append("image", imageFile);

  try {
    if (isUpdate) {
      await dispatch(updateProductThunk({ id: product._id, productData: data })).unwrap();
    } else {
      await dispatch(createProduct(data)).unwrap();
    }

    toast.success(isUpdate ? "Product updated!" : "Product added!");
    if (onSuccess) onSuccess();

    if (!isUpdate) {
      setFormData({ name: "", price: "", stock: "", category: "", rating: "", description: "", brand: "", warranty: "", sku: "" });
      setImageFile(null);
      setPreview(null);
    }
  } catch (error) {
    toast.error(isUpdate ? "Failed to update product" : "Failed to add product");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 mt-4 border-t">
      <div className="space-y-2">
        <label className="text-sm font-medium">Product Name *</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Wireless Headphones"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price ($) *</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="99.99"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock *</label>
          <Input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="" disabled>Select category</option>
            {category.map((cat) => (
              cat.category!=="All" && <option key={cat._id} value={cat._id}>{cat.category}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <Input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            placeholder="0 - 5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SKU</label>
          <Input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU12345"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Warranty</label>
          <Input
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            placeholder="1 Year"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Product details..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Product Image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {preview && (
          <div className="mt-2 h-32 w-32 rounded-md border overflow-hidden">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
            if (onSuccess) onSuccess();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isUpdate ? "Updating..." : "Adding...") : (isUpdate ? "Update Product" : "Add Product")}
        </Button>
      </div>
    </form>
  );
}
