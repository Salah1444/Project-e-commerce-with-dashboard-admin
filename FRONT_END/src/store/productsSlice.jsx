import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
  try {
    const response = await API.get("/products/getProducts");
    return response.data.products;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk("admin/createProduct", async (productData, thunkAPI) => {
  try {
    const response = await API.post("/products/addProduct", productData);
    return response.data.product;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add product");
  }
});

export const updateProductThunk = createAsyncThunk("admin/updateProduct", async ({ id, productData }, thunkAPI) => {
  try {
    const response = await API.put(`/products/updateProduct/${id}`, productData);
    return response.data.product;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update product");
  }
});

export const deleteProductThunk = createAsyncThunk("admin/deleteProduct", async (id, thunkAPI) => {
  try {
    await API.delete(`/products/deleteProduct/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete product");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    editingProduct: null,
    isSheetOpen: false,
    searchQuery: "",
    active: "Home",
    produits: [],
    allProducts: [],
    loading: false,
    addingProduct: false,
    updatingProduct: false,
    deletingProduct: false,
    error: null,
  },
  reducers: {
    ResetFilter: (state) => { state.products = state.allProducts;},
    FilterProducts: (state, action) => {
      if(action.payload){
        state.produits = state.allProducts.filter(
          (item) => (item.category?.name || item.category) === action.payload
        )
      }
      
    },
    handleEditClick: (state, action) => {
      state.editingProduct = action.payload;
      state.isSheetOpen = true;
    },
    handleSheetOpenChange: (state, action) => {
      state.isSheetOpen = action.payload;
      if (!action.payload) {
        state.editingProduct = null; 
      }
    },
    handleAddClick: (state) => {
      state.editingProduct = null;
      state.isSheetOpen = true;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (build) => {
    build 
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
        state.produits = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload;
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.addingProduct = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.addingProduct = false;
        state.allProducts.unshift(action.payload);
        state.produits.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.addingProduct = false;
        state.error = action.payload;
      })

      // updateProduct
      .addCase(updateProductThunk.pending, (state) => {
        state.updatingProduct = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.updatingProduct = false;
        const updated = action.payload;
        const idxAll = state.allProducts.findIndex(p => p._id === updated._id);
        const idxProd = state.produits.findIndex(p => p._id === updated._id);
        if (idxAll !== -1) state.allProducts[idxAll] = updated; 
        if (idxProd !== -1) state.produits[idxProd] = updated;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.updatingProduct = false;
        state.error = action.payload;
      })

      // deleteProduct
      .addCase(deleteProductThunk.pending, (state) => {
        state.deletingProduct = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.deletingProduct = false;
        state.allProducts = state.allProducts.filter(p => p._id !== action.payload); // ✅
        state.produits = state.produits.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.deletingProduct = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
export const {
  handleEditClick,
  FilterProducts,
  handleSheetOpenChange,
  handleAddClick,
  setSearchQuery,
  ResetFilter
} = productsSlice.actions;