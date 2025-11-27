import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChartOutlined, HomeOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, type MenuProps } from "antd";
import ReactIcon from "@/assets/svg/react.svg?react";
import { useTheme } from "@/components/theme-provider";
import { ROUTE_PATHS } from "@/router/route.constants";
import { useSelector, useSettingsStore } from "@/stores";

// 递归函数，找到匹配的菜单项
const findSelectedKeys = (items: MenuProps["items"], pathname: string, path: string[] = []) => {
  const selectedKeys: string[] = [];
  let openKeys: string[] = [];
  const travel = (items: MenuProps["items"], pathname: string, path: string[]) => {
    if (!items || items.length === 0 || !pathname) return false;

    for (const item of items!) {
      if (item!.key === pathname) {
        selectedKeys.push(item!.key);
        openKeys = [...path];
        return true; // 找到匹配的菜单项，返回true
      }
      if ((item as any).children) {
        path.push(item!.key as string);
        const found = travel((item as any).children, pathname, path);

        if (!found) {
          const parentPath = pathname.substring(0, pathname.lastIndexOf("/"));
          travel((item as any).children, parentPath, path);
        }
        // path.pop();
      }
    }
    return false; // 没有找到匹配的菜单项，返回false
  };

  travel(items, pathname, path);

  return { selectedKeys, openKeys };
};

const items: MenuProps["items"] = [
  {
    icon: <HomeOutlined />,
    label: <Link to={ROUTE_PATHS.landing}>首页</Link>,
    key: ROUTE_PATHS.landing,
  },
  {
    icon: <UserOutlined />,
    label: <Link to={ROUTE_PATHS.userManagement}>用户管理</Link>,
    key: ROUTE_PATHS.userManagement,
  },
  {
    icon: <MenuOutlined />,
    label: "一级菜单",
    key: ROUTE_PATHS.nestMenu,
    children: [
      {
        key: ROUTE_PATHS.subMenu1,
        label: <Link to={ROUTE_PATHS.subMenu1}>二级菜单-1</Link>,
      },
      {
        key: ROUTE_PATHS.subMenu2,
        label: <Link to={ROUTE_PATHS.subMenu2}>二级菜单-2</Link>,
      },
    ],
  },
  {
    icon: <BarChartOutlined />,
    label: <Link to={ROUTE_PATHS.sortTreeTable}>树形表格拖拽排序</Link>,
    key: ROUTE_PATHS.sortTreeTable,
  },
  {
    icon: <BarChartOutlined />,
    label: <Link to={ROUTE_PATHS.treeMenuSelect}>树形选择器</Link>,
    key: ROUTE_PATHS.treeMenuSelect,
  },
  {
    icon: <MenuOutlined />,
    label: "点位配置",
    key: ROUTE_PATHS.pointConfig,
    children: [
      {
        key: ROUTE_PATHS.pointConfigSettingPage,
        label: <Link to={ROUTE_PATHS.pointConfigSettingPage}>配置</Link>,
      },
      {
        key: ROUTE_PATHS.pointConfigViewPage,
        label: <Link to={ROUTE_PATHS.pointConfigViewPage}>展示</Link>,
      },
    ],
  },
  {
    icon: <MenuOutlined />,
    label: "three DEMO",
    key: ROUTE_PATHS.three,
    children: [
      {
        key: ROUTE_PATHS.threeCameraPoseVisualizer,
        label: <Link to={ROUTE_PATHS.threeCameraPoseVisualizer}>配置</Link>,
      },
    ],
  },
];

export default function SiderBar() {
  const location = useLocation();

  const firstRenderRef = useRef(true);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { collapsed } = useSettingsStore(useSelector(["collapsed"]));

  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (location.pathname === "/") return;

    const { selectedKeys, openKeys } = findSelectedKeys(items, location.pathname);
    setSelectedKeys(selectedKeys);
    // 首次渲染时，设置默认值
    if (firstRenderRef.current) {
      setOpenKeys(openKeys);
    }
    // 将首次渲染标记设置为false
    firstRenderRef.current = false;
  }, [location.pathname]);

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={isDarkMode ? "dark" : "light"}
      className="h-screen overflow-auto !sticky top-0 left-0 start-0"
    >
      <Link
        className="font-bold text-xl hover:text-current h-16 flex justify-center items-center gap-2 text-nowrap"
        to="/"
      >
        <ReactIcon className="size-6" />
        {collapsed ? null : <span className="text-gradient-ripple">React Admin</span>}
      </Link>
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
        // onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
        openKeys={openKeys}
        onOpenChange={(openKeys) => setOpenKeys(openKeys)}
        className="!border-e-0"
      />
    </Layout.Sider>
  );
}
