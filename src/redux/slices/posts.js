import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params) => {
    const { currentPage, pageLimit } = params;
    const { data } = await axios.get("/posts?", {
      params: { currentPage, pageLimit },
    });
    return data;
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/posts/tags");
  return data;
});

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (params) => {
    const { id, currentPage, pageLimit } = params;
    const { data } = await axios.get(`/posts/tags/${id}`, {
      params: { currentPage, pageLimit },
    });
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
    return id;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  total: 0,
  currentPage: 1,
  sortType: "createdAt",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    sort: (state, value) => {
      state.posts.items = state.posts.items.sort((a, b) => {
        if (value.payload === "comments") {
          return a[value.payload].length < b[value.payload].length ? 1 : -1;
        } else {
          return a[value.payload] < b[value.payload] ? 1 : -1;
        }
      });
    },
    setCurrentPage: (state) => {
      state.currentPage = state.currentPage + 1;
    },
    setSortType: (state, value) => {
      state.sortType = value.payload;
    },
    resetCurrentPage: (state) => {
      state.currentPage = 1;
    },
  },
  extraReducers: {
    //Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.total = action.payload.total;
      state.posts.items = action.payload.posts;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение статей по тегу
    [fetchPostsByTag.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPostsByTag.fulfilled]: (state, action) => {
      state.total = action.payload.total;
      state.posts.items = action.payload.posts;
      state.posts.status = "loaded";
    },
    [fetchPostsByTag.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    //Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (item) => item._id !== action.meta.arg
      );
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = "deleting error";
    },
  },
});

export const { sort, setCurrentPage, setSortType, resetCurrentPage } =
  postsSlice.actions;
export const postsReducer = postsSlice.reducer;
