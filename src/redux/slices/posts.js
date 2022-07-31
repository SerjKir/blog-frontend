import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params) => {
    const { sort, page, limit } = params;
    const { data } = await axios.get("/posts", {
      params: { sort, page, limit },
    });
    return data;
  }
);

export const fetchLastTags = createAsyncThunk(
  "posts/fetchTags",
  async (params) => {
    const { limit } = params;
    const { data } = await axios.get("/posts/tags", {
      params: { limit },
    });
    return data;
  }
);

export const fetchLastComments = createAsyncThunk(
  "posts/fetchComments",
  async (params) => {
    const { limit } = params;
    const { data } = await axios.get("/posts/comments", {
      params: { limit },
    });
    return data;
  }
);

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (params) => {
    const { id, sort, page, limit } = params;
    const { data } = await axios.get(`/posts/tags/${id}`, {
      params: { sort, page, limit },
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
  comments: {
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
    setSortType: (state, value) => {
      state.sortType = value.payload;
    },
    setCurrentPage: (state) => {
      state.currentPage = state.currentPage + 1;
    },
    resetDefault: (state) => {
      state.posts.items = [];
      state.currentPage = 1;
    },
  },
  extraReducers: {
    //Получение статей
    [fetchPosts.pending]: (state) => {
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
    //Получение последних тегов
    [fetchLastTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [fetchLastTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchLastTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    //Получение последних комментариев
    [fetchLastComments.pending]: (state) => {
      state.comments.status = "loading";
    },
    [fetchLastComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchLastComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
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

export const { setCurrentPage, setSortType, resetDefault } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
