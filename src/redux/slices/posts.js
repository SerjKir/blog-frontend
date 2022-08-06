import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getLastComments,
  getLastTags,
  getPosts,
  getPostsByTag,
  removePost,
} from "../../api/postApi";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params) => await getPosts(params)
);

export const fetchLastTags = createAsyncThunk(
  "posts/fetchTags",
  async (params) => await getLastTags(params)
);

export const fetchLastComments = createAsyncThunk(
  "posts/fetchComments",
  async (params) => await getLastComments(params)
);

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (params) => {
    return await getPostsByTag(params);
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => await removePost(id)
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
    [fetchRemovePost.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchRemovePost.pending]: (state) => {
      state.posts.status = "loaded";
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = "deleting error";
    },
  },
});

export const { setCurrentPage, setSortType, resetDefault } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
