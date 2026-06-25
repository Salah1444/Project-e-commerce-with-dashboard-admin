import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../services/api";
import { toast } from "react-toastify";

export const api = import.meta.env.VITE_BACKEND_URL+"/api";

export const addCategoryThunk = createAsyncThunk(
  "category/addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/category/create", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to add category");
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/category/delete/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to delete category");
    }
  }
);

//  fetch categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${api}/category/getCategory`);
      return res.data.categorys;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);
const CategorySlice = createSlice({
  name: "category", 
  initialState: {
    category: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
     
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
      })

      
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message);
        state.category.push(action.payload.category);
      })
      .addCase(addCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        toast.success(action.payload.message)
        state.loading = false;
        state.category = state.category.filter((category) => category._id !== action.payload.id);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  },
});

export default CategorySlice.reducer;