import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { toast } from "react-toastify";
import { logout } from "./userSlice.jsx";
export const AddToCart = createAsyncThunk("store/AddToCart", async (id) => {
    const res = await API.post('/cart/AddToCart', { productId: id });
    return res.data;
});
export const fetchCart = createAsyncThunk("store/fetchCart", async () => {
    try {
        const res = await API.get('/cart/getCart');
        return res.data.cart || [];
    } catch (error) {
        console.error("Erreur :", error);
    }
});
export const decreaseQte = createAsyncThunk("store/decreaseQte", async (id) => {
    try {
        const res = await API.put('/cart/DecreaseQte', { productId: id });
        return res.data;
    } catch (error) {
        console.error("Erreur :", error);
    }
});
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        loading: false,
        total: 0,
    },
    reducers: {
    },
    extraReducers: (build) => {
        build
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.total = action.payload.reduce(
                    (sum, item) => sum + (item.product?.price * item.quantity), 0
                ) || 0;
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                console.error("Erreur :", action.payload);
                state.loading = true;
            })
            .addCase(AddToCart.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.cart = action.payload.cart;
                    state.total = state.cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0) || null;
                }
            })
            .addCase(AddToCart.rejected,(state,action)=>{
                toast.error('Erreur:Please log in again.');
            })
            .addCase(decreaseQte.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.cart = action.payload.cart;
                    state.total = state.cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0) || null;
                }
            })
            .addCase(logout, (state) => {
                state.cart = [];
                state.total = 0;
                state.loading = false;
            })
    }
});

export default cartSlice.reducer;

