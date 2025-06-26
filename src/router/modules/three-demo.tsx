import { Link, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";
import { ROUTE_PATHS } from "@/constants/common";

export const threeDemoRoute: RouteObject = {
  path: ROUTE_PATHS.threeDemo,
  lazy: async () => ({
    Component: (await import("@/pages/three-demo/layout")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "Three Demo",
    crumb: () => <Link to={ROUTE_PATHS.threeDemo}>Three Demo</Link>,
  },
  children: [
    {
      path: ROUTE_PATHS.threeDemo1,
      lazy: async () => ({
        Component: (await import("@/pages/three-demo/three-demo-1")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "threeDemo-1",
        crumb: () => <Link to={ROUTE_PATHS.threeDemo1}>threeDemo-1</Link>,
      },
    },
  ],
};
