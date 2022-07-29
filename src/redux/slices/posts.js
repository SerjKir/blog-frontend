import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params) => {
    const { currentPage, pageLimit } = params;
    const { data } = await axios.get("/posts", {
      params: { currentPage, pageLimit },
    });
    return data;
  }
);

export const fetchLastTags = createAsyncThunk(
  "posts/fetchTags",
  async (params) => {
    const { tagsLimit } = params;
    const { data } = await axios.get("/posts/tags", {
      params: { tagsLimit },
    });
    return data;
  }
);

export const fetchLastComments = createAsyncThunk(
  "posts/fetchComments",
  async (params) => {
    const { commentsLimit } = params;
    const { data } = await axios.get("/posts/comments", {
      params: { commentsLimit },
    });
    return data;
  }
);

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
  comments: {
    items: [],
    status: "loading",
  },
  total: 0,
  currentPage: 1,
  sortType: "createdAt",
  scrollPosition: {
    scrollX: 0,
    scrollY: 0,
  },
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
    setScrollPosition: (state) => {
      state.scrollPosition.scrollX = window.scrollX;
      state.scrollPosition.scrollY = window.scrollY;
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
    //Получение последних тегов
    [fetchLastTags.pending]: (state) => {
      state.tags.items = [];
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
      state.comments.items = [];
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

export const {
  sort,
  setCurrentPage,
  setSortType,
  resetCurrentPage,
  setScrollPosition,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
