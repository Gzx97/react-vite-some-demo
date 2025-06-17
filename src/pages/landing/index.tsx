import { ReactFlow } from "@xyflow/react";
import { Flex, Typography } from "antd";

export default function LandingPage() {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
  return (
    <>
      <Typography.Title level={4}>首页</Typography.Title>

      <Flex gap={16}>
        <div style={{ height: "400px", width: "100%", background: "white", borderRadius: "8px" }}>
          <ReactFlow nodes={initialNodes} edges={initialEdges} fitView />
        </div>
      </Flex>
    </>
  );
}
