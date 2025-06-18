import { createContext, useContext } from "react";

interface ProductManagementContextValue {
  [key: string]: any;
}

const ProductManagementContext = createContext<ProductManagementContextValue>(
  {} as ProductManagementContextValue,
);

export const ProductManagementContextProvider = ProductManagementContext.Provider;
export const useProductManagementContext = (): ProductManagementContextValue =>
  useContext(ProductManagementContext);
