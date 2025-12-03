import { useState, useCallback } from "react";
import { login, LoginParams, UserInfo } from "@/api/modules/account/user"; // 导入已封装的 login API
import { RequestConfig } from "@/api/types";

/**
 * 登录状态管理 Hook
 * 封装登录逻辑、加载状态、错误处理、用户信息存储
 */
export function useLogin() {
  // 加载状态
  const [isPending, setIsPending] = useState<boolean>(false);
  // 用户信息（登录成功后存储）
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 错误信息
  const [error, setError] = useState<Error | null>(null);

  /**
   * 登录核心方法
   * @param params 登录参数（用户名、密码等）
   * @param config 自定义请求配置（如是否显示加载提示、错误提示等）
   * @returns Promise<UserInfo> 登录成功的用户信息
   */
  const mutate = useCallback(async (params: LoginParams, config?: RequestConfig): Promise<UserInfo> => {
    try {
      // 重置之前的错误状态
      setError(null);
      // 开始登录，设置加载状态为 true
      setIsPending(true);

      // 调用封装的 login API（默认显示加载提示，可通过 config 覆盖）
      const result = await login(params, {
        ...config, // 允许外部覆盖配置
      });

      // 登录成功：存储用户信息到 Hook 状态和本地存储
      setUserInfo(result);
      // 存储 Token 到本地存储（假设返回结果中包含 token，根据实际接口调整）
      if ((result as any).token) {
        localStorage.setItem("token", (result as any).token);
      }

      return result;
    } catch (err) {
      // 错误处理：捕获 API 封装中抛出的错误
      const error = err instanceof Error ? err : new Error("登录失败，请重试");
      setError(error);
      throw error; // 抛出错误，允许组件层面进一步处理
    } finally {
      // 无论成功失败，结束后设置加载状态为 false
      setIsPending(false);
    }
  }, []);

  /**
   * 重置登录状态（用于退出登录、重新登录等场景）
   */
  const reset = useCallback(() => {
    setIsPending(false);
    setUserInfo(null);
    setError(null);
    // 可选：重置时清除本地存储的 Token
    localStorage.removeItem("token");
  }, []);

  return {
    mutate,
    isPending,
    userInfo,
    error,
    reset,
  };
}
