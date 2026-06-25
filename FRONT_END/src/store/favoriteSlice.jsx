import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { logout } from "./userSlice.jsx";

export const ToggleFavorite = createAsyncThunk("favorite/ToggleFavorite", async (id) => {
    const res = await API.post('/favorites/ToggleFavorite', { productId: id });
    return res.data;
});

export const fetchFavorites = createAsyncThunk("favorite/fetchFavorites", async () => {
    try {
        const res = await API.get('/favorites/getFavorites');
        return res.data.favorites || [];
    } catch (error) {
        console.error("Error fetching favorites :", error);
    }
});

const favoriteSlice = createSlice({
    name: "favorite",
    initialState: {
        favorites: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (build) => {
        build
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favorites = action.payload || [];
                state.loading = false;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                console.error("Error :", action.payload);
                state.loading = false;
            })
            .addCase(ToggleFavorite.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.favorites = action.payload.favorites;
                }
            })
            .addCase(logout, (state) => {
                state.favorites = [];
                state.loading = false;
            })
    }
});

export default favoriteSlice.reducer;
