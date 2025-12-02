import { useEffect, useState } from "react";
import { Card, Flex } from "antd";
import * as THREE from "three";
import CameraPoseVisualizer from "./components/CameraPoseVisualizer";
import { cn } from "@/utils";
import { mockData } from "./data";

export type Pose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

export default function CameraPoseVisualizerPage() {
  // 模拟当前相机位姿
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);

  // 模拟历史轨迹
  const [history, setHistory] = useState<Pose[]>([]);

  // 轨迹最大长度（可根据需求调整，建议不超过 mockData 长度）
  const trajectoryLength = 20;

  // 🔥 核心修改：解析真实 SLAM 数据，模拟 WebSocket 实时推送
  useEffect(() => {
    let index = 0; // 数据索引，模拟依次接收数据

    // 模拟 WebSocket 实时推送（每隔 200ms 推送一条，可调整速度）
    const timer = setInterval(() => {
      if (index >= mockData.length) {
        // 数据推送完毕后，可选择停止或循环
        clearInterval(timer);
        return;
      }

      // 1. 获取当前数据项
      const slamData = mockData[index];
      const [x, y, z, qx, qy, qz, qw] = slamData.data;

      // 2. 解析为 Three.js 位置和四元数
      const position = new THREE.Vector3(x, y, z);
      const quaternion = new THREE.Quaternion(qx, qy, qz, qw);

      // 3. 格式化成本地 Pose 类型
      const newPose: Pose = { position, quaternion };
      console.log("SLAM 数据更新：", x, y, z, qx, qy, qz, qw);
      // 4. 更新当前位姿
      setCurrentPose(newPose);

      // 5. 更新历史轨迹（保持最大长度）
      setHistory((prev) => {
        const newHistory = [...prev, newPose];
        if (newHistory.length > trajectoryLength) {
          newHistory.shift(); // 超出长度时删除最旧的点
        }
        return newHistory;
      });

      // 索引递增，下一次取下一条数据
      index++;
    }, 200);

    // 组件卸载时清理定时器
    return () => clearInterval(timer);
  }, [trajectoryLength]);

  return (
    <>
      <Flex>
        <div className={cn("w-full h-96")}>
          Three.js Demo Placeholder
          <Card
            style={{ height: 500, marginBottom: 24, padding: 0 }} // 适当调高卡片高度，避免箭头被截断
            bodyStyle={{ padding: 0, height: "100%" }}
          >
            <CameraPoseVisualizer
              currentPose={currentPose}
              history={history}
              trajectoryLength={trajectoryLength}
            />
          </Card>
        </div>
      </Flex>
    </>
  );
}
