import axios from "axios";
import { baseEnvUrl } from "./consts";

const instance = axios.create({
  baseURL: baseEnvUrl,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem(
    "token"
  )}`;
  return config;
});

export default instance;
