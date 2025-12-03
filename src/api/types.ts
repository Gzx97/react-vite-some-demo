import type { AxiosRequestConfig, AxiosError, CancelTokenSource } from "axios";

/**
 * 后端响应通用格式（根据你的实际接口调整）
 * @template T 响应数据类型
 */
export interface ApiResponse<T = any> {
  [key: string]: any;
  data: T; // 响应数据
  // code: number; // 状态码（200成功，其他失败）
  // message: string; // 提示信息
  // data: T; // 响应数据
  // success: boolean; // 是否成功（可选，根据接口返回调整）
}

/**
 * 自定义请求配置（扩展 AxiosRequestConfig）
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示（默认true） */
  showError?: boolean;
  /** 是否忽略重复请求（默认true） */
  ignoreRepeat?: boolean;
  /** 响应数据是否需要解构（默认true，直接返回 data 字段） */
  isDestructData?: boolean;
}

/**
 * 重复请求缓存项
 */
interface RepeatRequestItem {
  cancel: CancelTokenSource["cancel"];
  url: string;
  method: string;
}

export type { AxiosError, CancelTokenSource, RepeatRequestItem };
