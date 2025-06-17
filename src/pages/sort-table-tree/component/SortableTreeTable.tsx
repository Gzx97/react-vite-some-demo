import { useCallback, useEffect, useState } from "react";
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
export const SortableTreeTable: React.FC<SortableTreeTableProps> = ({
  dataSource,
  onDragEnd,
  ...antTableProps
}) => {
  const [dropEndData, setDropEndData] = useState<Record<string, any>[]>();
  useEffect(() => {
    setDropEndData([...(dataSource ?? [])]);
  }, [dataSource]);

  const moveRow = useCallback(
    (dragId: string, dropId: string, dropOverType?: DropOverType) => {
      if (dragId === dropId || !dropOverType || !dataSource) return;

      setDropEndData((d: any) => {
        if (!d) return;
        const newData = sortDataByMove(d, dragId, dropId, dropOverType);
        // console.log(d, dragId, dropId, dropOverType);
        // console.log(newData);
        onDragEnd(newData, dragId, dropId, dropOverType);
        return newData;
      });
    },
    [dataSource],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        dataSource={dropEndData ?? dataSource}
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
