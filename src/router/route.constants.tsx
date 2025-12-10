import { Link, Outlet, type RouteObject } from "react-router-dom";
import { ProgressBar } from "@/components/progress-bar";

export const ROUTE_PATHS = {
  login: "/login",
  notFound: "/not-found",
  landing: "/landing",
  userManagement: "/user-management",
  nestMenu: "/nest-menu",
  subMenu1: "/nest-menu/sub-menu-1",
  subMenu2: "/nest-menu/sub-menu-2",
};

export const landingRoute: RouteObject = {
  path: ROUTE_PATHS.landing,
  lazy: async () => ({
    Component: (await import("@/pages/landing")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "首页",
  },
};

export const nestMenuRoute: RouteObject = {
  path: ROUTE_PATHS.nestMenu,
  lazy: async () => ({
    Component: (await import("@/pages/nest-menu")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "嵌套菜单",
    crumb: () => "嵌套菜单",
  },
  children: [
    {
      path: ROUTE_PATHS.subMenu1,
      lazy: async () => ({
        Component: (await import("@/pages/nest-menu/sub-menu-1")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "二级菜单-1",
        crumb: () => <Link to={ROUTE_PATHS.subMenu1}>二级菜单-1</Link>,
      },
    },
    {
      path: ROUTE_PATHS.subMenu2,
      lazy: async () => ({
        Component: (await import("@/pages/nest-menu/sub-menu-2")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "二级菜单-2",
        crumb: () => <Link to={ROUTE_PATHS.subMenu2}>二级菜单-2</Link>,
      },
      children: [
        {
          path: "/nest-menu/sub-menu-2/sub-menu-2-1",
          lazy: async () => ({
            Component: (await import("@/pages/nest-menu/sub-menu-2")).default,
          }),
        },
      ],
    },
  ],
};

export const userManagerRoute: RouteObject = {
  path: ROUTE_PATHS.userManagement,
  lazy: async () => ({
    Component: (await import("@/pages/user-management")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "用户管理",
    crumb: () => <Link to={ROUTE_PATHS.userManagement}>用户管理</Link>,
  },
};
