import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Table, TableProps } from "antd";
import DragRow, { DragRowProps, DropOverType } from "./DragRow";
import { sortDataByMove } from "./utile";

export interface SortableTreeTableProps extends Omit<TableProps, "components"> {
  // 由于涉及到操作数据，rowKey为必填项
  rowKey: string | ((record: Record<string, any>) => string);
  onDragEnd: (
    dragEndData: Record<string, any>,
    dragId: string,
    dropId: string,
    dropOverType: DropOverType,
  ) => void;
}
export const SortableTreeTable: React.FC<SortableTreeTableProps> = ({ ...antTableProps }) => {
  const dataSource = [
    {
      id: "1",
      name: "类别-1",
      children: [
        {
          id: "1-1",
          name: "类别-1-1",
        },
        {
          id: "1-2",
          name: "类别-1-2",
          children: [
            {
              id: "1-2-1",
              name: "类别-1-2-1",
            },
          ],
        },
      ],
    },
    { id: "2", name: "类别-2" },
    { id: "3", name: "类别-3" },
    { id: "4", name: "类别-4" },
    { id: "5", name: "类别-5" },
    { id: "6", name: "类别-6" },
    { id: "7", name: "类别-7" },
    { id: "8", name: "类别-8" },
    { id: "9", name: "类别-9" },
  ];
  const [dropEndData, setDropEndData] = useState<Record<string, any>[]>(dataSource);

  const moveRow = (dragId: string, dropId: string, dropOverType?: DropOverType) => {
    if (dragId === dropId || !dropOverType) return;
    setDropEndData((d) => {
      const newData = sortDataByMove(d, dragId, dropId, dropOverType);
      return newData;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        dataSource={dropEndData}
        pagination={false}
        components={{
          body: {
            row: DragRow,
          },
        }}
        onRow={(record: Record<string, any>, index) => {
          const attr: DragRowProps = {
            id: String(record?.id ?? index),
            moveRow,
          };
          return attr;
        }}
        {...antTableProps}
      />
    </DndProvider>
  );
};
