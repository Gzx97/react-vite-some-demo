import { Link, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";
import { ROUTE_PATHS } from "@/constants/common";

export const treeMenuSelectRoute: RouteObject = {
  path: ROUTE_PATHS.treeMenuSelect,
  lazy: async () => ({
    Component: (await import("@/pages/tree-menu-select/layout")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "sortTreeTable",
    crumb: () => <Link to={ROUTE_PATHS.treeMenuSelect}>树形选择器</Link>,
  },
};
