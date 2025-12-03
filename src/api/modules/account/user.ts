import { get, post } from "../../request";
import type { RequestConfig } from "../../types";
const baseUri = "/tenant-api/org";

// 用户登录参数类型
export interface LoginParams {
  account?: string;
  password?: string;
}

// 用户信息响应类型
export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  role: string;
}

/**
 * 用户登录
 */
export const login = (params: LoginParams, config?: RequestConfig): Promise<UserInfo> => {
  return post<UserInfo>(`${baseUri}/sign-in/account`, params, {
    ...config,
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = (config?: RequestConfig) => {
  return get<UserInfo>("/user/info", undefined, {
    ...config,
  });
};

/**
 * 退出登录
 */
export const logout = (config?: RequestConfig) => {
  return post("/auth/logout", undefined, config);
};
