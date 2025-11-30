import { FC, useEffect, useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import ThickArrow from "./ThickArrow";

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
  // 轨迹点 Ref（更新轨迹数据）
  const trajectoryRef = useRef<THREE.Points>(null!);

  // 缓存几何体和二进制数组（仅在trajectoryLength变化时重建）
  const [geometry, positions, colors] = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    // 预分配固定大小的顶点/颜色数组
    const posArray = new Float32Array(trajectoryLength * 3);
    const colArray = new Float32Array(trajectoryLength * 3);

    // 创建动态更新的BufferAttribute（标记为频繁更新）
    const posAttr = new THREE.BufferAttribute(posArray, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    const colAttr = new THREE.BufferAttribute(colArray, 3);
    colAttr.setUsage(THREE.DynamicDrawUsage);

    geom.setAttribute("position", posAttr);
    geom.setAttribute("color", colAttr);

    return [geom, posArray, colArray] as const;
  }, [trajectoryLength]);

  // 🔥 核心逻辑1：更新当前相机位姿（位置+旋转）
  useEffect(() => {
    if (!currentPose || !groupRef.current) return;

    // 更新摄像头组的位置
    groupRef.current.position.copy(currentPose.position);
    // 更新摄像头组的旋转（四元数）
    groupRef.current.quaternion.copy(currentPose.quaternion);
  }, [currentPose]);

  // 🔥 核心逻辑2：更新轨迹点数据（位置+渐变颜色）
  useEffect(() => {
    if (!trajectoryRef.current || !geometry) return;

    // 清空历史数据（避免残留旧轨迹）
    positions.fill(0);
    colors.fill(0);

    // 轨迹基础颜色（蓝色，可自定义）
    const baseColor = new THREE.Color(0x0000ff);
    let pointIndex = 0;

    // 遍历历史位姿，填充轨迹点数据
    for (const pose of history) {
      if (pointIndex >= trajectoryLength) break; // 防止数组越界

      // 1. 设置轨迹点位置
      const posOffset = pointIndex * 3;
      positions[posOffset] = pose.position.x;
      positions[posOffset + 1] = pose.position.y;
      positions[posOffset + 2] = pose.position.z;

      // 2. 设置渐变颜色（越新的点颜色越亮）
      const alpha = (pointIndex + 1) / Math.min(history.length, trajectoryLength);
      const fadedColor = baseColor.clone().multiplyScalar(alpha); // 透明度渐变
      const colorOffset = pointIndex * 3;
      colors[colorOffset] = fadedColor.r;
      colors[colorOffset + 1] = fadedColor.g;
      colors[colorOffset + 2] = fadedColor.b;

      pointIndex++;
    }

    // 3. 清零剩余未使用的轨迹点（避免幽灵点）
    for (let j = pointIndex; j < trajectoryLength; j++) {
      const offset = j * 3;
      positions[offset] = positions[offset + 1] = positions[offset + 2] = 0;
      colors[offset] = colors[offset + 1] = colors[offset + 2] = 0;
    }

    // 4. 通知Three.js更新属性（关键：否则不会重绘）
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 5. 优化渲染范围（只渲染有数据的点，提升性能）
    geometry.setDrawRange(0, Math.min(history.length, trajectoryLength));
  }, [history, positions, colors, trajectoryLength, geometry]);

  // 🔥 核心逻辑3：组件卸载时清理资源（防止内存泄漏）
  useEffect(() => {
    return () => {
      // 销毁轨迹几何体
      geometry.dispose();
      // 清空Ref
      groupRef.current = null!;
      trajectoryRef.current = null!;
    };
  }, [geometry]);

  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }} gl={{ preserveDrawingBuffer: true }}>
      {/* 1. 光照系统 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* 2. 辅助工具 */}
      <gridHelper args={[10, 10]} />
      <axesHelper args={[3]} />

      {/* 3. 摄像头模型组（位置+旋转跟随currentPose） */}
      <group ref={groupRef}>
        <axesHelper args={[0.5]} />
        <ThickArrow
          color={0xff0000}
          shaftRadius={0.05}
          shaftLength={0.7}
          headRadius={0.15}
          headLength={0.3}
        />
      </group>

      {/* 4. 轨迹点渲染 */}
      <points ref={trajectoryRef} geometry={geometry}>
        <pointsMaterial
          size={0.15}
          vertexColors={true} // 启用顶点渐变颜色
          sizeAttenuation={true} // 远处点自动缩小
          transparent={true} // 启用透明度
          opacity={0.8} // 轨迹点透明度
        />
      </points>

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
