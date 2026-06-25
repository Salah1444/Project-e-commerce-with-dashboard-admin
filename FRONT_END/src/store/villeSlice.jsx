import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";
import { toast } from "react-toastify";
export const fetchVille = createAsyncThunk(
    "ville/fetchVille",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/ville/");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error");
        }
    }
);
export const  AddVille = createAsyncThunk(
    "ville/AddVille",
    async (ville, { rejectWithValue }) => {
        try {
            const res = await API.post("/ville/create", ville);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error");
        }
    }
);
export const DeleteVille = createAsyncThunk(
    "ville/DeleteVille",
    async (ville, { rejectWithValue }) => {
        try {
            const res = await API.delete(`/ville/delete/${ville}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error Network");
        }
    }
);

const citySlice = createSlice({
    name: "city",
    initialState: {
        ville: [],
        loading:false,
        error:null,
    },
    reducers: {

    },
    extraReducers: (build) => {
        build
            .addCase(fetchVille.fulfilled, (state, action) => {
                state.loading = false;
                state.ville = action.payload.ville;
            })
            .addCase(fetchVille.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(AddVille.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(AddVille.fulfilled, (state, action) => {
                toast.success(action.payload.message)
                state.loading = false;
                state.ville.push(action.payload.ville);
            })
            .addCase(AddVille.rejected, (state, action) => {    
                toast.error(action.payload.message)
            })
            .addCase(DeleteVille.fulfilled, (state, action) => {
                toast.success(action.payload.message)
                state.loading = false;
            })
            .addCase(DeleteVille.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(DeleteVille.rejected, (state, action) => {    
                toast.error(action.payload)
            })
    }
});
export default citySlice.reducer;