import { RouterProvider } from "react-router-dom";
import { App as AntdApp } from "antd";
import { AntdConfigProvider } from "./components/antd-config-provider";
import { StaticAntd } from "./components/static-antd";
import { router } from "./router";

export default function App() {
  return (
    <AntdConfigProvider>
      <AntdApp>
        <StaticAntd />
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </AntdApp>
    </AntdConfigProvider>
  );
}
