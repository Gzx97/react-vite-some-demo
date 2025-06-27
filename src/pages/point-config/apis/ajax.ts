import axios from "axios";
import { getToken } from "../utils/storage.utils";
import { MSError } from "./MSError";

const ajax = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

ajax.interceptors.request.use((request) => {
  request.headers = Object.assign({}, request.headers);
  const token = getToken();
  if (token) {
    request.headers["Authorization"] = "Bearer " + token;
  }
  return request;
});

ajax.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log(error);
    if (!error || !error.response) {
      throw new MSError("500", "服务器异常，请稍后再试");
    }
    const status = error.response.status;
    if (status === 401) {
      throw new MSError("401", "未授权");
    } else if (status === 500) {
      throw new MSError("500", "服务器异常，请稍后再试");
    } else {
      throw error.response.data;
    }
  },
);
export default ajax;
