import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initToken = () => {
  return window.localStorage.getItem("token");
};

const initialState = {
  token: initToken(),
  data: null,
  status: "loading",
};

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/registration", params);
    return data;
  }
);

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (params) => {
    const { data } = await axios.get("/auth/me");
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      window.localStorage.removeItem("token");
      state.token = null;
      state.data = null;
      state.status = "logout";
    },
    setToken: (state) => {
      state.token = initToken();
    },
  },
  extraReducers: {
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state) => {
      window.localStorage.removeItem("token");
      state.token = null;
      state.data = null;
      state.status = "error";
    },
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state) => {
      window.localStorage.removeItem("token");
      state.token = null;
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => !!state.auth.token;
export const authReducer = authSlice.reducer;
export const { logout, setToken } = authSlice.actions;
