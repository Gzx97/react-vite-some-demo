import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";
import { landingRoute, nestMenuRoute, ROUTE_PATHS, userManagerRoute } from "./route.constants";

const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.login,
    lazy: async () => ({
      Component: (await import("@/pages/login")).default,
    }),
    HydrateFallback: ProgressBar,
  },
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("@/layouts")).default,
    }),
    HydrateFallback: ProgressBar,
    children: [
      {
        index: true,
        element: <Navigate replace to={ROUTE_PATHS.landing} />,
      },
      landingRoute,
      userManagerRoute,
      nestMenuRoute,
    ],
  },
  {
    path: "*",
    lazy: async () => ({
      Component: (await import("@/pages/not-found")).default,
    }),
    HydrateFallback: ProgressBar,
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_APP_BASE_URL,
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
