import { createContext, useContext } from "react";

interface XXXContextValue {
  [key: string]: any;
}

const XXXContext = createContext<XXXContextValue>({} as XXXContextValue);

export const XXXContextProvider = XXXContext.Provider;
export const useXXXContext = (): XXXContextValue => useContext(XXXContext);

// const { queryType, queryId } = useXXXContext();
{
  /* <XXXContextProvider
  value={{
    queryType: queryType,
    queryId: queryId,
  }}
></XXXContextProvider>; */
}
