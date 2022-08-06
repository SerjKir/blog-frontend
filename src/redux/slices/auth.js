import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkAuth, login, me, registration } from "../../api/userApi";
import { getToken, removeToken } from "../../consts";

const initialState = {
  token: getToken(),
  data: null,
  status: "loading",
};

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    return await registration(params);
  }
);

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params) => {
    return await login(params);
  }
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  return await me();
});

export const check = createAsyncThunk("auth/checkAuth", async () => {
  return await checkAuth();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      removeToken();
      state.token = null;
      state.data = null;
      state.status = "logout";
    },
    setToken: (state) => {
      state.token = getToken();
    },
  },
  extraReducers: {
    //Проверка авторизации
    [check.pending]: (state) => {
      state.status = "loading";
    },
    [check.fulfilled]: (state, action) => {
      state.token = getToken();
      state.status = "loaded";
    },
    [check.rejected]: (state) => {
      removeToken();
      state.token = null;
      state.data = null;
      state.status = "unauthorized";
    },
    //Получение данных о пользователе
    [fetchMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchMe.rejected]: (state) => {
      removeToken();
      state.token = null;
      state.data = null;
      state.status = "error";
    },
    //Регистрация пользователя
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state) => {
      removeToken();
      state.token = null;
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => !!state.auth.token;
export const authReducer = authSlice.reducer;
export const { logout, setToken } = authSlice.actions;
