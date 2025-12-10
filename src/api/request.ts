import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from "axios";
import { RequestConfig, ApiResponse, RepeatRequestItem } from "./types";
import { message } from "antd";

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 存储正在进行的请求（用于取消重复请求）
const pendingRequests = new Map<string, RepeatRequestItem>();

/**
 * 生成请求唯一标识（url + method + 参数）
 */
const generateRequestKey = (config: RequestConfig): string => {
  const { url, method = "get", params, data } = config;
  const paramsStr = params ? JSON.stringify(params) : "";
  const dataStr = data ? JSON.stringify(data) : "";
  return `${url}-${method}-${paramsStr}-${dataStr}`;
};

/**
 * 添加请求到缓存
 */
const addPendingRequest = (config: RequestConfig, cancel: CancelTokenSource["cancel"]) => {
  const key = generateRequestKey(config);
  if (!pendingRequests.has(key) && config.ignoreRepeat !== false) {
    pendingRequests.set(key, { cancel, url: config.url!, method: config.method! });
  }
};

/**
 * 移除请求缓存
 */
const removePendingRequest = (config: RequestConfig) => {
  const key = generateRequestKey(config);
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key);
  }
};

/**
 * 取消所有正在进行的请求
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach(({ cancel }) => cancel("请求已取消"));
  pendingRequests.clear();
};

// ========================= 请求拦截器 =========================
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 处理重复请求（取消之前的相同请求）
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    addPendingRequest(config, source.cancel);

    // 2. 添加请求头（如 Token、用户信息等）
    const token = localStorage.getItem("token"); // 从本地存储获取 Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 移除请求缓存
    removePendingRequest(error.config as RequestConfig);
    // hideToast();
    return Promise.reject(error);
  },
);

// ========================= 响应拦截器 =========================
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const config = response.config as RequestConfig;

    // 1. 移除请求缓存
    removePendingRequest(config);

    // 3. 处理响应数据
    const { data, status } = response;

    // HTTP 状态码校验（2xx 视为成功）
    if (status < 200 || status >= 300) {
      if (config.showError !== false) {
        message.error(`请求失败：${status}`);
      }
      return Promise.reject(new Error(`HTTP 错误：${status}`));
    }

    // 后端业务状态码校验（根据实际接口调整）
    if (data.code !== 200) {
      // 特殊状态码处理（如 Token 过期、无权限等）
      if (data.code === 401) {
        message.error("登录状态已过期，请重新登录");
        // 清除 Token 并跳转到登录页
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (config.showError !== false) {
        message.error(data.message);
      }
      return Promise.reject(new Error(data.message || `业务错误：${data.code}`));
    }

    // 4. 是否解构响应数据（默认直接返回 data 字段）
    return config.isDestructData !== false ? data.data : data;
  },
  (error: AxiosError<ApiResponse>) => {
    // 1. 移除请求缓存
    removePendingRequest(error.config as RequestConfig);

    // 2. 隐藏加载中提示
    const config = error.config as RequestConfig;

    // 3. 错误分类处理
    if (axios.isCancel(error)) {
      // 取消请求的错误（不提示）
      console.log("请求被取消：", error.message);
      return Promise.reject(new Error("请求已取消"));
    }

    // 网络错误
    if (!error.response) {
      if (config?.showError !== false) {
        message.error("网络连接错误");
      }
      return Promise.reject(new Error("网络错误"));
    }

    // 后端返回的错误
    const { status, data } = error.response;
    if (config?.showError !== false) {
      message.error(data?.message || `请求失败：${status}`);
    }
    return Promise.reject(error);
  },
);

// ========================= 封装请求方法 =========================
/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数（拼接在 URL 上）
 * @param config 自定义请求配置
 */
export const get = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<T> => {
  return service.get<T, T>(url, { params, ...config });
};

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config 自定义请求配置
 */
export const post = <T = any>(
  url: string,
  data?: Record<string, any>,
  config?: RequestConfig,
): Promise<T> => {
  return service.post<T, T>(url, data, config);
};

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config 自定义请求配置
 */
export const put = <T = any>(url: string, data?: Record<string, any>, config?: RequestConfig): Promise<T> => {
  return service.put<T, T>(url, data, config);
};

/**
 * DELETE 请求
 * @param url 请求地址
 * @param params 请求参数（拼接在 URL 上）
 * @param config 自定义请求配置
 */
export const del = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<T> => {
  return service.delete<T, T>(url, { params, ...config });
};

// 导出所有请求方法
export default { get, post, put, del, cancelAllRequests };
