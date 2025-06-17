import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import "./index.less";

const type = "DragRow";
export type DropOverType = "upward" | "downward" | "inside";

export interface DragRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string; //目标id
  moveRow: (dragId: string, dropId: string, type?: DropOverType) => void;
  disableDrop?: boolean;
}

const DragRow: React.FC<DragRowProps> = ({ id, moveRow, className, style, disableDrop, ...restProps }) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [dropOverType, setDropOverType] = React.useState<DropOverType>();

  const [{ isOver }, drop] = useDrop({
    accept: type,
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      if (clientOffset && hoverBoundingRect) {
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        const hoverPercentage = (hoverClientY - hoverMiddleY) / hoverMiddleY;
        const getClassName = (hoverPercentage: number) => {
          const offsetValue = 0.4;
          if (hoverPercentage > offsetValue) {
            return "downward";
          } else if (hoverPercentage < -offsetValue) {
            return "upward";
          } else {
            return "inside";
          }
        };
        const dropClassName = getClassName(hoverPercentage);
        setDropOverType(dropClassName);
      }
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
      };
    },

    drop: (item: { id: string }) => {
      const dragId = item.id;
      const targetId = id;
      moveRow(dragId, targetId, dropOverType);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { id },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const canDrop = !disableDrop;

  if (canDrop) {
    drop(drag(ref));
  }

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? ` drop-over-${dropOverType}` : ""}`}
      style={{
        cursor: canDrop ? "move" : "auto",
        ...style,
      }}
      {...restProps}
    />
  );
};
export default DragRow;
