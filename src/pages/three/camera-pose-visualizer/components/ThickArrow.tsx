import { FC } from "react";
import * as THREE from "three";

/**
 * @param color 箭头的颜色
 * @param shaftRadius 箭头杆（根部）的粗细
 * @param shaftLength 箭头杆的长度
 * @param headRadius 箭头头部的宽度
 * @param headLength 箭头头部的长度
 */
const ThickArrow: FC<{
  color?: THREE.ColorRepresentation;
  shaftRadius?: number;
  shaftLength?: number;
  headRadius?: number;
  headLength?: number;
}> = ({
  color = 0xff0000,
  shaftRadius = 0.05, // <-- 你可以在这里修改“根部粗细”
  shaftLength = 0.5,
  headRadius = 0.2,
  headLength = 0.3,
}) => {
  // three.js 的圆柱体和圆锥体默认是沿 Y 轴（向上）的
  // 我们的箭头需要沿 Z 轴（向前），所以我们旋转整个组
  const totalLength = shaftLength + headLength;

  return (
    // 旋转整个组，使其指向 +Z 方向
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* 1. 箭头杆 (圆柱体) */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* 2. 箭头头部 (圆锥体) */}
      <mesh position={[0, shaftLength + headLength / 2, 0]}>
        <coneGeometry args={[headRadius, headLength, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export default ThickArrow;
