import { memo } from "react";
import * as THREE from "three";
import ThickArrow from "./ThickArrow";
import { Pose } from "..";

// 缓存历史箭头组件，仅当props变化时重渲染
const HistoryArrow = memo(
  ({ pose, color, opacity }: { pose: Pose; color: THREE.ColorRepresentation; opacity: number }) => {
    return (
      <group
        position={pose.position}
        quaternion={pose.quaternion}
        // 历史箭头缩小，避免与当前箭头重叠
        scale={0.9}
      >
        <ThickArrow
          color={color}
          shaftRadius={0.03} // 历史箭头更细
          shaftLength={0.5} // 历史箭头更短
          headRadius={0.1}
          headLength={0.2}
        />
        {/* 可选：为历史箭头添加半透明效果，区分当前箭头 */}
        <meshBasicMaterial transparent opacity={opacity} />
      </group>
    );
  },
);

export default HistoryArrow;
