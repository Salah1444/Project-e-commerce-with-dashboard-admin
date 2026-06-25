import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"


export const getOrderById = createAsyncThunk("orders/getOrderById",async (id, thunkAPI) => {
  try {
    
    const res = await API.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch order");
 } })

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, thunkAPI) => {
  try {
    const response = await API.get("/orders");
    return response.data.orders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order :{},
    loadingOrders :false,
    loadingOrder : false,
    errorOrder : null,
    errorOrders: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchOrders.pending, (state, action) => {
        state.loadingOrders = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loadingOrders = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.errorOrders = action.payload;
      })
      .addCase(getOrderById.pending, (state, action) => {
        state.loadingOrder = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loadingOrder = false;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loadingOrder = false;
        state.errorOrder = action.payload;
      });

  },
});

export default orderSlice.reducer;
