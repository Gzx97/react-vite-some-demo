import { Link, Outlet, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";
import { ROUTE_PATHS } from "@/constants/common";

export const pointConfigRoute: RouteObject = {
  path: ROUTE_PATHS.pointConfig,
  lazy: async () => ({
    Component: () => <Outlet />,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "点位配置",
    crumb: () => "点位配置",
  },
  children: [
    {
      path: ROUTE_PATHS.pointConfigSettingPage,
      lazy: async () => ({
        Component: (await import("@/pages/point-config/setting-page")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "点位配置",
        crumb: () => <Link to={ROUTE_PATHS.pointConfigSettingPage}>点位配置</Link>,
      },
    },
    {
      path: ROUTE_PATHS.pointConfigViewPage,
      lazy: async () => ({
        Component: (await import("@/pages/point-config/view-page")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "点位展示",
        crumb: () => <Link to={ROUTE_PATHS.pointConfigViewPage}>点位展示</Link>,
      },
    },
  ],
};
