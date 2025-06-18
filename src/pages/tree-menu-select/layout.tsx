import React, { useEffect } from "react";
import { Layout, TreeDataNode } from "antd";
import CategoryTreeMenu from "./components/CategoryTreeMenu";
import styles from "./index.module.less";
import { ProductManagementContextProvider } from "./Provider";
import { addTreeDataKeyById } from "@/utils/treeData";

const categoryDataSource = [
  {
    id: "1",
    title: "类别-1",
    children: [
      {
        id: "1-1",
        title: "类别-1-1",
      },
      {
        id: "1-2",
        title: "类别-1-2",
        children: [
          {
            id: "1-2-1",
            title: "类别-1-2-1",
          },
        ],
      },
    ],
  },
  { id: "2", title: "类别-2" },
  { id: "3", title: "类别-3" },
  { id: "4", title: "类别-4" },
  { id: "5", title: "类别-5" },
  { id: "6", title: "类别-6" },
  { id: "7", title: "类别-7" },
  { id: "8", title: "类别-8" },
  { id: "9", title: "类别-9" },
];

const getCategoryTreeData = async (): Promise<any> => {
  // 模拟异步获取数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(addTreeDataKeyById(categoryDataSource));
    }, 500);
  });
};
const TreeMenuSelect: React.FC = () => {
  const [categoryTreeSelectId, setCategoryTreeSelectId] = React.useState<ID>("");
  const [treeData, setTreeData] = React.useState<TreeDataNode[]>([]);

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCategoryTreeData();
        setTreeData(data);

        // 默认选中第一个节点
        if (data.length > 0) {
          setCategoryTreeSelectId(data[0].key as ID);
        }
      } catch (error) {
        console.error("加载分类数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <ProductManagementContextProvider value={{}}>
      <Layout>
        <Layout.Sider collapsedWidth={0} width={220} style={{ backgroundColor: "white", border: "none" }}>
          <div className={styles["sider-content-wrapper"]}>
            <CategoryTreeMenu
              treeData={treeData}
              loading={loading}
              categoryTreeSelectId={categoryTreeSelectId}
              onCategoryTreeSelect={setCategoryTreeSelectId}
            />
          </div>
        </Layout.Sider>
        <Layout.Content>选择的类别ID: {categoryTreeSelectId}</Layout.Content>
      </Layout>
    </ProductManagementContextProvider>
  );
};
export default TreeMenuSelect;
