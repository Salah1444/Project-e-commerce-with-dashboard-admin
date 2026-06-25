import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"

// Basic config placeholder. In a real app, grab token from local storage.


export const fetchStats = createAsyncThunk("admin/fetchStats", async (_, thunkAPI) => {
  try {
    const response = await API.get("/admin/stats");
    return response.data.stats;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrders = createAsyncThunk("admin/fetchOrders", async (_, thunkAPI) => {
  try {
    const response = await API.get("/admin/orders");
    return response.data.orders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});



const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      revenue: 0,
      last24hOrders: 0,
      newUsers: 0,
      orders: [],
      users: [],
      lowStockProducts: []
    },
    loadingState: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loadingState = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loadingState = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loadingState = false;
        state.error = action.payload;
        
      });
      
  },
});

export default adminSlice.reducer;
