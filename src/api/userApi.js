import axios from "./axios";

export const registration = async (params) => {
  const { data } = await axios.post("/auth/registration", params);
  return data;
};

export const login = async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
};

export const checkAuth = async () => {
  await axios.get("/auth/check");
};

export const me = async () => {
  const { data } = await axios.get("/auth/me");
  return data;
};

export const updateMe = async (data) => {
  const res = await axios.patch("/auth/me", data);
  return res.data;
};

export const uploadAvatar = async (formData) => {
  const { data } = await axios.post("/upload", formData);
  return data;
};
