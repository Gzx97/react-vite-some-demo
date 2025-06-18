import React, { Key, useEffect, useMemo, useState } from "react";
import { Empty, Input, Spin, Tree, TreeDataNode } from "antd";
import styles from "./CategoryTreeMenu.module.less";
import { filterTreeData, getAllKeys } from "@/utils/treeData";
const { Search } = Input;

type CategoryTreeMenuProps = {
  categoryTreeSelectId: ID;
  onCategoryTreeSelect: (id: ID) => void;
  treeData?: TreeDataNode[];
  loading?: boolean;
};

const CategoryTreeMenu: React.FC<CategoryTreeMenuProps> = ({
  treeData = [],
  categoryTreeSelectId,
  onCategoryTreeSelect,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 搜索时过滤树数据
  const filteredTreeData = useMemo(() => {
    const data = filterTreeData(treeData, searchValue);

    return data;
  }, [treeData, searchValue]);

  // 处理节点展开
  const handleExpand = (keys: Key[]) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // 处理节点选择
  const handleSelect = (selectedKeys: Key[]) => {
    if (selectedKeys.length > 0) {
      onCategoryTreeSelect(selectedKeys[0] as ID);
    }
  };

  // 初始展开所有节点
  useEffect(() => {
    if (treeData.length > 0 && !searchValue) {
      setExpandedKeys(getAllKeys(treeData));
      setAutoExpandParent(true);
    }
  }, [treeData, searchValue]);
  const onSearchChange = (value: string) => {
    setSearchValue(value);
    // 搜索时自动展开所有节点
    if (value) {
      setExpandedKeys(getAllKeys(treeData));
      setAutoExpandParent(true);
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["menu-header"]}>
        {/* 按照name搜索 */}
        <Search placeholder="搜索类别..." allowClear onSearch={onSearchChange} />
      </div>
      <div className={styles["menu-content"]}>
        {loading ? (
          <Spin spinning={true} className={styles.spinner} />
        ) : filteredTreeData.length > 0 ? (
          <Tree
            selectedKeys={[categoryTreeSelectId]}
            onSelect={handleSelect}
            onExpand={handleExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            fieldNames={{ title: "title", key: "id" }}
            treeData={filteredTreeData}
            blockNode
            showLine={{ showLeafIcon: false }}
            className={styles.tree}
          />
        ) : (
          <Empty description={searchValue ? "未找到匹配类别" : "暂无类别数据"} className={styles.empty} />
        )}
      </div>
    </div>
  );
};
export default CategoryTreeMenu;
