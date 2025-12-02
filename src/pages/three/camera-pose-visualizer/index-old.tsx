import { useEffect, useState } from "react";
import { Card, Flex } from "antd";
import * as THREE from "three";
import CameraPoseVisualizer from "./components/CameraPoseVisualizer";
import { cn } from "@/utils";

export type Pose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

const pos1 = new THREE.Vector3(parseFloat("0.156"), parseFloat("0.35566"), parseFloat("0.3"));
const quat1 = new THREE.Quaternion(
  parseFloat("0.44443"),
  parseFloat("0.34455555"),
  parseFloat("0.3"),
  parseFloat("1"),
);
const pos2 = new THREE.Vector3(parseFloat("0.256"), parseFloat("0.25566"), parseFloat("0.333"));
const quat2 = new THREE.Quaternion(
  parseFloat("0.24443"),
  parseFloat("0.34455555"),
  parseFloat("0.4"),
  parseFloat("1"),
);
const testPose: Pose = { position: pos1, quaternion: quat1 };
const testPoseArr: Pose[] = [
  { position: pos1, quaternion: quat1 },
  { position: pos2, quaternion: quat2 },
];
export default function CameraPoseVisualizerPage() {
  // 模拟当前相机位姿
  const [currentPose, setCurrentPose] = useState<{
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
  } | null>(null);

  // 模拟历史轨迹
  const [history, setHistory] = useState<
    Array<{
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
    }>
  >([]);

  // 轨迹最大长度
  const trajectoryLength = 100;

  // 模拟实时更新相机位姿（每秒生成一个新位姿）
  useEffect(() => {
    const timer = setInterval(() => {
      // 随机生成位置（在[-2,2]范围内）
      const position = new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2);
      // 随机生成旋转（四元数）
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(new THREE.Euler((Math.random() * Math.PI) / 2, Math.random() * Math.PI, 0));

      // 更新当前位姿
      setCurrentPose({ position, quaternion });

      // 更新历史轨迹（保持最大长度）
      setHistory((prev: any) => {
        const newHistory = [...prev, { position, quaternion }];
        if (newHistory.length > trajectoryLength) {
          newHistory.shift(); // 超出长度时删除最旧的点
        }
        return newHistory;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [trajectoryLength]);
  return (
    <>
      <Flex>
        <div className={cn("w-full h-96")}>
          Three.js Demo Placeholder
          <Card
            style={{ height: 300, marginBottom: 24, padding: 0 }}
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
