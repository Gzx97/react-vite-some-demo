import { Key } from "react";
import { TreeDataNode } from "antd";

/**
 * 为树形结构中的每个节点添加key属性（如果不存在），值等于节点的id
 * @param {Array} treeData 树形结构数据
 * @param {string} [idField='id'] 节点ID的字段名
 * @param {string} [keyField='key'] 需要添加的key字段名
 * @param {string} [childrenField='children'] 子节点的字段名
 * @returns {Array} 添加了key属性的新树形结构
 */
export const addTreeDataKeyById = (
  treeData: Array<any>,
  idField: string = "id",
  keyField: string = "key",
  childrenField: string = "children",
): Array<any> => {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return [];
  }

  return treeData.map((node) => {
    // 创建新节点对象，避免修改原数据
    const newNode = { ...node };

    // 如果节点没有key属性，则从id复制
    if (newNode[keyField] === undefined && newNode[idField] !== undefined) {
      newNode[keyField] = newNode[idField];
    }

    // 递归处理子节点
    if (newNode[childrenField] && Array.isArray(newNode[childrenField])) {
      newNode[childrenField] = addTreeDataKeyById(newNode[childrenField], idField, keyField, childrenField);
    }

    return newNode;
  });
};

// 递归过滤树节点
export const filterTreeData = (data: TreeDataNode[], searchValue: string): TreeDataNode[] => {
  if (!searchValue.trim()) return data;

  return data
    .map((node) => {
      const nodeTitle = (node.title || "") as string;
      const isMatch = nodeTitle.toLowerCase().includes(searchValue.toLowerCase());

      // 如果节点匹配，直接返回
      if (isMatch) return node;

      // 检查子节点
      if (node.children) {
        const filteredChildren = filterTreeData(node.children, searchValue);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }

      return null;
    })
    .filter(Boolean) as TreeDataNode[];
};

export // 收集所有节点键值
const getAllKeys = (treeData: TreeDataNode[]): Key[] => {
  const keys: Key[] = [];

  const traverse = (nodes: TreeDataNode[]) => {
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children) traverse(node.children);
    });
  };

  traverse(treeData);
  return keys;
};
