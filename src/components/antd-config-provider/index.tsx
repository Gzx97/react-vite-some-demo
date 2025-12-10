import type { PropsWithChildren } from "react";
import { legacyLogicalPropertiesTransformer, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme as antdTheme } from "antd";

import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

export function AntdConfigProvider({ children }: PropsWithChildren) {
  const { defaultAlgorithm } = antdTheme;
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          cssVar: true, // 开启 css 变量
          hashed: false, // 如果你的应用中只存在一个版本的 antd，你可以设置为 false 来进一步减小样式体积。
          algorithm: defaultAlgorithm,
          token: {
            // colorPrimary: "#1677FF",
          },
          components: {
            Layout: {
              headerPadding: "0 24px",
            },
          },
        }}
        componentSize="large"
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
