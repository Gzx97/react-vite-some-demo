import { Link, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";
import { ROUTE_PATHS } from "@/constants/common";

export const sortTreeTableRoute: RouteObject = {
  path: ROUTE_PATHS.sortTreeTable,
  lazy: async () => ({
    Component: (await import("@/pages/sort-table-tree/layout")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "sortTreeTable",
    crumb: () => <Link to={ROUTE_PATHS.sortTreeTable}>sortTreeTable</Link>,
  },
};
