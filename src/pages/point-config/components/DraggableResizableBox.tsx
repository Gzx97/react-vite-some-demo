import React, { memo } from "react";
import styles from "./DraggableResizableBox.module.less";
import DragRotateBox from "./DragRotateBox";
type PositionType = {
  x: number;
  y: number;
};

type DraggableResizableBoxProps = {
  /** 位移坐标 */
  position?: PositionType;
  /** 设置位移坐标 */
  onPositionChange?: (positionInfo: PositionType) => void;
  size?: {
    width: number;
    height: number;
  };
  readonly?: boolean;
  children: React.ReactNode;
};

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
  position = { x: 100, y: 100 },
  size = { width: 50, height: 50 },
  onPositionChange,
  children,
}) => {
  return (
    <DragRotateBox position={position} onPositionChange={onPositionChange}>
      <div
        style={{
          width: size.width,
          height: size.height,
        }}
        className={styles["wrapper"]}
      >
        {children}
      </div>
    </DragRotateBox>
  );
};

export default memo(DraggableResizableBox);
