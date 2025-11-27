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
  sortTreeTable: "/sort-tree-table",
  treeMenuSelect: "/tree-menu-select",
  echartsDemo: "/echarts-demo",

  pointConfig: "/point-config",
  pointConfigSettingPage: "/point-config/setting-page",
  pointConfigViewPage: "/point-config/view-page",
  three: "/three",
  threeCameraPoseVisualizer: "/three/camera-pose-visualizer",
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

export const echartsDemoRoute: RouteObject = {
  path: ROUTE_PATHS.echartsDemo,
  lazy: async () => ({
    Component: (await import("@/pages/echarts-demo/layout")).default,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "Echarts Demo",
    crumb: () => <Link to={ROUTE_PATHS.echartsDemo}>Echarts Demo</Link>,
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

export const threeRoute: RouteObject = {
  path: ROUTE_PATHS.three,
  lazy: async () => ({
    Component: () => <Outlet />,
  }),
  HydrateFallback: ProgressBar,
  handle: {
    title: "轨迹DEMO",
    crumb: () => "轨迹DEMO",
  },
  children: [
    {
      path: ROUTE_PATHS.threeCameraPoseVisualizer,
      lazy: async () => ({
        Component: (await import("@/pages/three/camera-pose-visualizer")).default,
      }),
      HydrateFallback: ProgressBar,
      handle: {
        title: "相机捕获",
        crumb: () => <Link to={ROUTE_PATHS.threeCameraPoseVisualizer}>相机捕获</Link>,
      },
    },
  ],
};
