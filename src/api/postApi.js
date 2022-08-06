import axios from "./axios";

export const addPost = async (fields) => {
  const { data } = await axios.post("/posts", fields);
  return data;
};

export const uploadPostImage = async (formData) => {
  const { data } = await axios.post("/upload", formData);
  return data;
};

export const updatePost = async (id, fields) => {
  const { data } = await axios.patch(`/posts/${id}`, fields);
  return data;
};

export const getPost = async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
};

export const getPosts = async (params) => {
  const { sort, page, limit } = params;
  const { data } = await axios.get("/posts", {
    params: { sort, page, limit },
  });
  return data;
};

export const getPostsByTag = async (params) => {
  const { id, sort, page, limit } = params;
  const { data } = await axios.get(`/posts/tags/${id}`, {
    params: { sort, page, limit },
  });
  return data;
};

export const removePost = async (id) => {
  await axios.delete(`/posts/${id}`);
  return id;
};

export const getPostComments = async (id) => {
  const { data } = await axios.get(`posts/${id}/comments`);
  return data;
};

export const getLastTags = async (params) => {
  const { limit } = params;
  const { data } = await axios.get("/posts/tags", {
    params: { limit },
  });
  return data;
};

export const getLastComments = async (params) => {
  const { limit } = params;
  const { data } = await axios.get("/posts/comments", {
    params: { limit },
  });
  return data;
};

export const addComment = async (id, text) => {
  await axios.post(`/posts/${id}/comments`, { text });
};
