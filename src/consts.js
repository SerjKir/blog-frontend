export const baseEnvUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const pageLimit = 5,
  commentsLimit = 3,
  tagsLimit = 5;

export const removeToken = () => {
  window.localStorage.removeItem("token");
};

export const getToken = () => {
  return window.localStorage.getItem("token");
};

export const addToken = (token) => {
  window.localStorage.setItem("token", token);
};
