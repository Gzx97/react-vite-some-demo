import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import ThickArrow from "./ThickArrow";
import HistoryArrow from "./HistoryArrow";

type Pose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

// 轨迹可视化组件
const CameraPoseVisualizer: FC<{
  currentPose: Pose | null;
  history: Pose[];
  trajectoryLength: number;
}> = ({ currentPose, history, trajectoryLength }) => {
  // 摄像头组 Ref（控制位置和旋转）
  const groupRef = useRef<THREE.Group>(null!);
  // 轨迹基础颜色（蓝色，可自定义）
  const baseColor = new THREE.Color(0xff0000);

  // 🔥 核心逻辑1：更新当前相机位姿（位置+旋转）
  useEffect(() => {
    if (!currentPose || !groupRef.current) return;

    // 更新摄像头组的位置
    groupRef.current.position.copy(currentPose.position);
    // 更新摄像头组的旋转（四元数）
    groupRef.current.quaternion.copy(currentPose.quaternion);
  }, [currentPose]);

  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }} gl={{ preserveDrawingBuffer: true }}>
      {/* 1. 光照系统 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* 2. 辅助工具 */}
      <gridHelper args={[10, 10]} />
      <axesHelper args={[3]} />

      {/* 🔥 3. 历史轨迹箭头（核心修改） */}
      {history.map((pose, index) => {
        // 计算渐变系数：index越大（越新），系数越接近1（颜色越亮）
        const gradient = (index + 1) / Math.min(history.length, trajectoryLength);
        // 颜色渐变：baseColor * 渐变系数（越旧越暗）
        const arrowColor = baseColor.clone().multiplyScalar(gradient);
        // 透明度渐变：越旧越透明（0.2~0.8）
        const opacity = 0.2 + gradient * 0.6;

        return (
          <HistoryArrow
            key={`history-arrow-${index}`} // 唯一key，避免重复渲染
            pose={pose}
            color={arrowColor}
            opacity={opacity}
          />
        );
      })}

      {/* 4. 当前摄像头模型组（位置+旋转跟随currentPose） */}
      {currentPose && (
        <group ref={groupRef}>
          <axesHelper args={[0.5]} />
          <ThickArrow
            color={0xff0000} // 当前箭头用红色，与历史箭头区分
            shaftRadius={0.05}
            shaftLength={0.7}
            headRadius={0.15}
            headLength={0.3}
          />
        </group>
      )}

      {/* 5. 轨道控制器 */}
      <OrbitControls
        enableDamping // 阻尼效果（拖拽更丝滑）
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
      />
    </Canvas>
  );
};

export default CameraPoseVisualizer;
