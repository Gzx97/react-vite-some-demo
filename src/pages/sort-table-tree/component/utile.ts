type DataType = {
  id?: string;
  [key: string]: any;
  children?: DataType[];
};
type DropOverType = "upward" | "downward" | "inside";
type ID = string | number;
/**
 * 节点位置信息
 */
type NodeLocation = {
  node: DataType; // 当前节点
  parentArray: DataType[]; // 当前节点所在的数组
  parentNode: DataType | null; // 当前节点的父节点（如果是根节点则为null）
  index: number; // 当前节点在数组中的索引
  parentLocation: NodeLocation | null; // 父节点的位置信息（用于构建祖先链）
};

/**
 * 在树形结构中查找节点位置
 */
const findNodeLocation = (
  data: DataType[],
  id: ID,
  parentNode: DataType | null = null,
  parentArray: DataType[] = data,
  parentLocation: NodeLocation | null = null,
): NodeLocation | null => {
  for (let i = 0; i < parentArray.length; i++) {
    const node = parentArray[i];
    const currentLocation: NodeLocation = {
      node,
      parentArray,
      parentNode,
      index: i,
      parentLocation,
    };

    // 找到目标节点
    if (node.id === id) {
      return currentLocation;
    }

    // 递归搜索子节点
    if (node.children) {
      const found = findNodeLocation(node.children, id, node, node.children, currentLocation);
      if (found) return found;
    }
  }
  return null;
};
/**
 * 检查拖拽节点是否是目标节点的祖先
 */
const isAncestor = (dragLocation: NodeLocation, dropLocation: NodeLocation): boolean => {
  let parent = dropLocation.parentLocation;
  while (parent) {
    if (parent.node === dragLocation.node) {
      return true;
    }
    parent = parent.parentLocation;
  }
  return false;
};
/**
 * 移除空children属性
 */
const removeEmptyChildren = (node: DataType) => {
  if (node.children && node.children.length === 0) {
    delete node.children;
  }
};
/**
 *
 * @param data 数据源
 * @param dragId 拖拽行的id
 * @param dropId 目标行的id
 * @param dropOverType 操作类型
 * @returns
 */
export const sortDataByMove = (
  data: readonly DataType[],
  dragId: ID,
  dropId: ID,
  dropOverType: DropOverType,
): DataType[] => {
  // 1. 深拷贝原始数据
  const newData = JSON.parse(JSON.stringify(data));

  // 2. 查找节点位置
  const dragLocation = findNodeLocation(newData, dragId);
  const dropLocation = findNodeLocation(newData, dropId);

  // 3. 检查节点是否存在
  if (!dragLocation || !dropLocation) return newData;

  // 4. 检查祖先关系（拖拽节点不能是目标节点的祖先）
  if (isAncestor(dragLocation, dropLocation)) return newData;

  // 5. 从原位置移除拖拽节点
  const [dragNode] = dragLocation.parentArray.splice(dragLocation.index, 1);

  // 6. 移除后处理原父节点的空children
  if (dragLocation.parentNode) {
    removeEmptyChildren(dragLocation.parentNode);
  }

  // 7. 根据放置类型处理
  switch (dropOverType) {
    case "inside": {
      // 放置到目标节点内部
      if (!dropLocation.node.children) {
        dropLocation.node.children = [];
      }
      dropLocation.node.children.push(dragNode);
      break;
    }

    case "upward":
    case "downward": {
      // 调整目标节点索引（当同一层级移动且拖拽节点在目标节点之前时）
      let adjustedIndex = dropLocation.index;
      if (dragLocation.parentArray === dropLocation.parentArray && dragLocation.index < dropLocation.index) {
        adjustedIndex -= 1;
      }

      // 计算插入位置
      const insertIndex = dropOverType === "upward" ? adjustedIndex : adjustedIndex + 1;

      // 插入到目标位置
      dropLocation.parentArray.splice(insertIndex, 0, dragNode);
      break;
    }
  }

  return newData;
};
