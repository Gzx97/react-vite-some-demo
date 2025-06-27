import { createContext, useContext } from "react";

interface DispatchConfigContextValue {
  wrapperSize?: {
    width: number;
    height: number;
  };
  scale?: number;
  [key: string]: any;
}

const DispatchConfigContext = createContext<DispatchConfigContextValue>({} as DispatchConfigContextValue);

export const DispatchConfigProvider = DispatchConfigContext.Provider;
export const useDispatchConfigContext = (): DispatchConfigContextValue => useContext(DispatchConfigContext);
