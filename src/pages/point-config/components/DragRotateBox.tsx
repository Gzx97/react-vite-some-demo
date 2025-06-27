import React, { memo, useRef } from "react";
import { useDispatchConfigContext } from "./DispatchConfigProvider";
type PositionType = {
  x: number;
  y: number;
};

type DragRotateBoxProps = {
  /** 容器的宽高，用来计算比例 */
  containerInfo?: {
    width: number;
    height: number;
  };
  /** 旋转角度 */
  rotation?: number;
  /** 设置旋转角度 */
  onRotationChange?: (rotation: number) => void;
  /** 位移坐标 */
  position?: PositionType;
  /** 设置位移坐标 */
  onPositionChange?: (positionInfo: PositionType) => void;
  transformOrigin?: "top" | "bottom";
  readonly?: boolean;
  children: React.ReactNode;
  /** 使用的单位 */
  unit?: "px" | "%";
};

const DragRotateBox: React.FC<DragRotateBoxProps> = ({
  rotation,
  // containerInfo,
  position = { x: 0, y: 0 },
  onPositionChange,
  readonly,
  transformOrigin = "top",
  unit = "px",
  children,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const isPX = unit === "px";
  const { scale = 1 } = useDispatchConfigContext();
  const configScaleX = 1920 / 1623;
  const configScaleY = 1080 / 912;
  return (
    <div
      ref={boxRef}
      style={{
        position: "absolute",
        top: isPX ? position?.y : `${position?.y}%`,
        left: isPX ? position?.x : `${position?.x}%`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${transformOrigin} center`,
        cursor: readonly ? "pointer" : "move",
        zIndex: "99",
      }}
      onMouseDown={(e) => {
        if (readonly) return;
        e.preventDefault();
        const { pageX: mouseDownPageX, pageY: mouseDownPageY } = e;
        const startX = mouseDownPageX / scale / configScaleX - position.x;
        const startY = mouseDownPageY / scale / configScaleY - position.y;

        const onMouseMove = (e: MouseEvent) => {
          const x = e.pageX / scale / configScaleX - startX;
          const y = e.pageY / scale / configScaleY - startY;
          const percentageX = x;
          const percentageY = y;
          const position = {
            x: percentageX,
            y: percentageY,
          };
          onPositionChange?.(position);
        };
        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }}
      // onMouseDown={(e) => {
      //   if (readonly) return;
      //   e.preventDefault();
      //   const { pageX: mouseDownPageX, pageY: mouseDownPageY } = e;
      //   const width = containerInfo?.width ?? 1;
      //   const height = containerInfo?.height ?? 1;
      //   const startX =
      //     mouseDownPageX - (isPX ? position.x : (position.x / 100) * width);
      //   const startY =
      //     mouseDownPageY - (isPX ? position.y : (position.y / 100) * height);
      //   const onMouseMove = (e: MouseEvent) => {
      //     const x = e.pageX - startX || 1;
      //     const y = e.pageY - startY || 1;
      //     const percentageX = isPX ? x : _.ceil((x / width) * 100, 4);
      //     const percentageY = isPX ? y : _.ceil((y / height) * 100, 4);
      //     const position = {
      //       x: percentageX,
      //       y: percentageY,
      //     };
      //     onPositionChange?.(position);
      //   };
      //   const onMouseUp = () => {
      //     document.removeEventListener("mousemove", onMouseMove);
      //     document.removeEventListener("mouseup", onMouseUp);
      //   };
      //   document.addEventListener("mousemove", onMouseMove);
      //   document.addEventListener("mouseup", onMouseUp);
      // }}
    >
      {/* scaleX(1.18299445) scaleY(1.18421053) */}
      {children}
    </div>
  );
};

export default memo(DragRotateBox);
