import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../services/api";

export const AddUser = createAsyncThunk(
  "user/AddUser",
  async (form, { rejectWithValue }) => {
    try {
      const res = await API.post("/users/register", form);
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const AddAdmin = createAsyncThunk(
  "user/AddAdmin",
  async (form, { rejectWithValue }) => {
    try {
      const res = await API.post("/admin/create-admin", form);
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/users/login", data);

      if (res.data.success && res.data.token) {
        // Save token to localStorage immediately
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        return res.data;
      } else {
        toast.error(res.data.message || "Login failed");
        return rejectWithValue(res.data);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network error or invalid credentials";
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  },
);

export const getMe = createAsyncThunk(
  "user/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/users/me");
      return res.data;
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/admin/users");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
  {
    // Skip if users are already loaded (prevents duplicate calls)
    condition: (_, { getState }) => {
      const { usersLoaded, usersLoading } = getState().user;
      if (usersLoaded || usersLoading) return false;
    },
  },
);
export const UpdatePassword = createAsyncThunk(
  "user/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const  { _id, ...form } = data;
      const res = await API.put(`/users/updatePassword/${_id}`, form);
       return res.data;
    } catch (error) {
       return rejectWithValue(
        error.response || "Something went wrong"
      );
    }
  },
);
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const { _id, ...form } = data;
      const res = await API.put(`/users/update/${_id}`, form);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response  || "Error");
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`users/delete/${_id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || error.response || "Error");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: "",
    loginForm: false,
    token: localStorage.getItem("token") || "",
    isAuth: !!localStorage.getItem("token"),
    user: null,
    users: [],
    usersLoading: false,
    usersLoaded: false,
    usersError: null,
    searchQuery: "",
    passwordUpdated : false,

  },
  reducers: {
    SetLoginForm: (state) => {
      state.loginForm = !state.loginForm;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    logout: (state) => {
      state.token = "";
      state.isAuth = false;
      state.user = null;
      localStorage.removeItem("token");
      toast.success("Logged out");
    },
  },
  extraReducers: (builder) => {
    builder
      // delet profiel
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.token = "";
        state.isAuth = false;
        state.user = null;
        localStorage.removeItem("token");
        action.payload.success
          ? toast.success(action.payload.message)
          : console.log(action.payload);
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        action.payload.message
          ? toast.error(action.payload.message)
          : console.log(action.payload);
      })
      // update user
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        action.payload.success ? toast.success(action.payload.message) : null;
        state.error = "";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        action.payload.message ? toast.error(action.payload.message) : null;
      })
      // register user
      .addCase(AddUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(AddUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.error = "";
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(AddUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      // login user
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
          state.isAuth = true;
          state.loginForm = false;
          state.error = "";
          // Reload page after a short delay to ensure localStorage is saved
        } else {
          state.error = action.payload.message || "Login failed";
        }
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Login failed";
        state.isAuth = false;
        state.loading = false;
        state.token = "";
      })
      // getMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.loading = false;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuth = false;
        state.token = "";
        state.loading = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.usersLoaded = true;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        !action.payload.success && toast.error('Erreur',action.payload);
      })
      .addCase(UpdatePassword.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(UpdatePassword.fulfilled, (state, action) => {
        state.usersLoading = false;
        action.payload.success ? toast.success(action.payload.message) :'';
        state.passwordUpdated = true;
      })
      .addCase(UpdatePassword.rejected, (state, action) => {
        state.usersLoading = false;
        !action.payload.success ? toast.error(`${action.payload.data.message}`): null; 
      });
  },
});

export default userSlice.reducer;
export const { SetLoginForm, logout, setSearchQuery } = userSlice.actions;
