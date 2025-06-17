import { SortableTreeTable } from "./component/SortableTreeTable";

export default function SortTreeTableLayout() {
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
  return (
    <div>
      <SortableTreeTable
        rowKey={"id"}
        dataSource={dataSource}
        columns={[
          {
            title: "分类编码",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "分类名称",
            dataIndex: "name",
            key: "name",
          },
        ]}
        onDragEnd={(dragEndData, dragId, dropId, dropOverType) => {
          console.log("拖拽结束:", dragEndData, dragId, dropId, dropOverType);
        }}
      />
    </div>
  );
}
