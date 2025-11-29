//三维动态库
import { FC, useEffect, useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import ThickArrow from "./ThickArrow";
type Pose = {
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

const CameraPoseVisualizer: FC<{
  currentPose: Pose | null;
  history: Pose[];
  trajectoryLength: number;
}> = ({ currentPose, history, trajectoryLength }) => {
  // 创建一个 Ref 来引用 3D 组 (Group)，这个组将代表摄像头
  const groupRef = useRef<THREE.Group>(null!);
  const trajectoryRef = useRef<THREE.Points>(null!);

  // 使用 useEffect 来在 'pose' prop 变化时，命令式地更新 3D 对象的位姿
  // 这是 react-three-fiber 中与外部状态同步的推荐方式
  useEffect(() => {
    if (groupRef.current) {
      // 将 ref 引用的 3D 对象的 position 和 quaternion
      // 设置为从 prop 接收到的新值
      // groupRef.current.position.copy(currentPose.position);
      // groupRef.current.quaternion.copy(currentPose.quaternion);
      console.log("Current Pose Updated:", currentPose);
      groupRef.current.position.copy(testPose.position);
      groupRef.current.quaternion.copy(testPose.quaternion);
    }
  }, [currentPose, testPose.position, testPose.quaternion]); // 依赖项是 pose，当 pose 变化时此 effect 重新运行

  // NOV011445: START - 内存泄漏的核心修复
  // 我们使用 useMemo 来创建一次几何体和固定大小的缓冲区。
  // 这样, useEffect 钩子将*更新*这些缓冲区,而不是*创建新*的。
  const [geometry, positions, colors] = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    // 创建固定大小的数组, 对应 trajectoryLength
    const posArray = new Float32Array(trajectoryLength * 3);
    const colArray = new Float32Array(trajectoryLength * 3);

    // 创建 *可动态更新* 的 BufferAttribute
    const posAttr = new THREE.BufferAttribute(posArray, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage); // 关键: 告诉 three.js 这个会经常变

    const colAttr = new THREE.BufferAttribute(colArray, 3);
    colAttr.setUsage(THREE.DynamicDrawUsage); // 关键

    geom.setAttribute("position", posAttr);
    geom.setAttribute("color", colAttr);

    // 返回所有, 以便在 useEffect 和 render 中使用
    return [geom, posArray, colArray];
  }, [trajectoryLength]); // 依赖项是 trajectoryLength, 确保它只创建一次
  // NOV011445: END

  useEffect(() => {
    console.log("Geometry:", geometry);
    console.log("positions :", positions);
    console.log("colors:", colors);
  }, [geometry, positions, colors]);

  // OCT232324 START: 这个 effect 负责在 history 变化时，动态更新轨迹（点云）的几何体
  // NOV011445: 修改此 useEffect 以使用“原地更新”
  useEffect(() => {
    if (!trajectoryRef.current) return;
    //要修改回来
    // return;

    // NOV011445: START - 原地更新逻辑
    const baseColor = new THREE.Color(0x0000ff); // 轨迹颜色（黄）
    let i = 0; // 跟踪我们填充了多少个点

    // 1. 遍历 props 传入的 history, 填充固定大小的数组
    const history = testPoseArr;
    for (const pose of history) {
      console.log("Updating trajectory point:", pose.position);
      console.log("Updating trajectory point:", i);
      // 设置 (x, y, z)
      positions[i * 3] = pose.position.x;
      positions[i * 3 + 1] = pose.position.y;
      positions[i * 3 + 2] = pose.position.z;

      // 设置颜色 (r, g, b)
      const alpha = (i + 1) / history.length;
      const fadedColor = baseColor.clone().multiplyScalar(alpha);
      colors[i * 3] = fadedColor.r;
      colors[i * 3 + 1] = fadedColor.g;
      colors[i * 3 + 2] = fadedColor.b;

      i++; // 移动到下一个点
    }

    // 2. (关键) 将缓冲区的剩余部分“清零”
    //    这可以防止当 history.length < trajectoryLength 时,
    //    旧的“幽灵”点保留在轨迹的末尾。
    for (let j = i; j < trajectoryLength; j++) {
      positions[j * 3] = 0;
      positions[j * 3 + 1] = 0;
      positions[j * 3 + 2] = 0;
      colors[j * 3] = 0;
      colors[j * 3 + 1] = 0;
      colors[j * 3 + 2] = 0;
    }

    // 3. 关键：通知 three.js 属性已更新
    //    我们没有创建任何新东西, 只是告诉 Three.js "嘿, 去重绘这个"
    // trajectoryRef.current.geometry.attributes.position.needsUpdate = true; //
    // trajectoryRef.current.geometry.attributes.color.needsUpdate = true; //

    // 4. (可选) 优化绘制范围, 只绘制我们填充的部分。
    //    这可以防止 three.js 徒劳地绘制我们清零的(0,0,0)点。
    trajectoryRef.current.geometry.setDrawRange(0, history.length);
    // NOV011445: END

    // ---- (原始的泄漏代码 已被替换) ----
  }, [history, positions, colors, trajectoryLength]); // 依赖项是 history 和我们创建的数组
  // OCT232324 END
  return (
    // Canvas 是 R3F 的根，它创建了 three.js 场景和渲染器
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
      {/* 1. 光照 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* 2. 辅助工具 */}
      {/* 10x10 的网格 */}
      <gridHelper args={[10, 10]} />
      {/* 世界坐标系 (R=X, G=Y, B=Z)，长度为 3 */}
      <axesHelper args={[3]} />

      {/* 3. 摄像头模型
         我们使用一个 <group> 来代表摄像头。
         我们移动和旋转这个 group，它内部的子对象（箭头和坐标轴）会随之移动。
      */}
      <group ref={groupRef}>
        {/* 摄像头本身的小坐标系，长度为 0.5 */}
        <axesHelper args={[0.5]} />
        {/* 一个箭头，表示摄像头的“前方”（通常是Z轴） */}
        <ThickArrow
          color={0xff0000}
          shaftRadius={0.05} // 杆的粗细
          shaftLength={0.7} // 杆的长度
          headRadius={0.15} // 头的宽度
          headLength={0.3} // 头的长度
        />
      </group>

      {/* OCT232324 START: 4. 轨迹 (历史位姿) */}
      <points ref={trajectoryRef} geometry={geometry}>
        <bufferGeometry />
        <pointsMaterial
          size={0.15} // 轨迹点的大小
          vertexColors={true} // 启用顶点颜色（用于实现渐变）
          sizeAttenuation={true} // 点在远处时变小
        />
      </points>
      {/* OCT232324 END */}

      {/* 5. 控制器 */}
      <OrbitControls />
    </Canvas>
  );
};

export default CameraPoseVisualizer;
