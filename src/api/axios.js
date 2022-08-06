import axios from "axios";
import { baseEnvUrl, getToken } from "../consts";

const instance = axios.create({
  baseURL: baseEnvUrl,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default instance;
