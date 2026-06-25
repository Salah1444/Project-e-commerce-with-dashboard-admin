import { createSlice } from "@reduxjs/toolkit";
const StoreSlice = createSlice({
  name: "store",
  initialState: {
    totalUn: 0,
    isVisible: false,
    DropFavoritState: false,
    DetailisVisible: false,
    quantite: 0,
    total: 0,
    active: 'Home',
  },
  reducers: {
    ActivateLink: (state, action) => {
      state.active = action.payload
    },
    ToggleCart: (state) => {
      state.DropFavoritState = false;
      state.isVisible = !state.isVisible;
    },
    ToggleFavorit: (state) => {
      state.isVisible = false;
      state.DropFavoritState = !state.DropFavoritState;
    },

    
   
  },
  
});

export default StoreSlice.reducer;
export const {
  ActivateLink,
  ToggleCart,
  ToggleFavorit,
  
  
} = StoreSlice.actions;
