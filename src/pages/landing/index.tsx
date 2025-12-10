import { ReactFlow } from "@xyflow/react";
import { Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t } = useTranslation();
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
  return (
    <>
      <Typography.Title level={4}>
        首页
        {t("title")}
      </Typography.Title>
    </>
  );
}
