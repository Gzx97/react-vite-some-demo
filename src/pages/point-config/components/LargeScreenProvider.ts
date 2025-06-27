import { createContext, useContext } from "react";

interface LargeScreenContextValue {
  /** 接口的刷新标识 */
  refreshCurrent: number;
  [key: string]: any;
}

const LargeScreenContext = createContext<LargeScreenContextValue>({} as LargeScreenContextValue);

export const LargeScreenContextProvider = LargeScreenContext.Provider;
export const useLargeScreenContext = (): LargeScreenContextValue => useContext(LargeScreenContext);
