import API from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchRev",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/users/reviews/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response || error.message || "Failed to fetch reviews",
      );
    }
  },
);

export const UpdateRatingReveiw = createAsyncThunk( 
  "reviews/UpdateRatingReview",
  async ({ rating, id }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/admin/review-rating/${id}`, { rating });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.data || "Error");
    }
  },
);
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    product:{},
    reviews: [],
    loading: false,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(fetchReviews.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        console.log(action.payload);
      })
      .addCase(UpdateRatingReveiw.fulfilled, (state, action) => {
        const review = state.reviews.find(
          (r) => r._id == action.payload.review._id,
        );

        if (review) {
          review.rating = action.payload.review.rating;
        }

        state.loading = false;
        toast.success(action.payload.message);
      })
      
      .addCase(UpdateRatingReveiw.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateRatingReveiw.rejected, (state, action) => {
        action.payload.message
          ? toast.error(action.payload.message)
          : toast.error("Faild to update Rating");
      })

      ;
  },
});
export default reviewsSlice.reducer;
export const {} = reviewsSlice.actions;
