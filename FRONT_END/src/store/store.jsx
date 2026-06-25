import { configureStore } from "@reduxjs/toolkit";
import StoreReducer from "./storeSlice.jsx";
import CategorySlice from "./CategorySlice.jsx";
import userSlice from "./userSlice.jsx"
import cartSlice from "./cartSlice.jsx"
import favoriteSlice from "./favoriteSlice.jsx"
import adminSlice from './adminSlice.jsx';
import productsSlice from "./productsSlice.jsx";
import villeSlice from "./villeSlice.jsx";
import reviewsSlice from './reviewsSlice.jsx'
import orderSlice from './orderSlice.jsx';
const store = configureStore({
    reducer: {
        store: StoreReducer,
        category: CategorySlice,
        user: userSlice,
        cart : cartSlice,
        favorite: favoriteSlice,
        admin: adminSlice,
        products : productsSlice,
        ville : villeSlice,
        reviews : reviewsSlice,
        orders : orderSlice

    }
})
export default store