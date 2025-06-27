import { useMemo } from "react";
import { useRequest } from "ahooks";
import { message } from "antd";
import { largeScreenDevicePointsApi } from "../apis/large-screen";
import { pointInfoType } from "../components/DispatchView";
import { isTempId } from "../utils/generateUniqueId";

export const usePointInfoRequest = () => {
  /** 查询(实况)点位信息 */
  const { run: queryRealTimeDevicePointsList, data: realTimeDevicePointsList } = useRequest(
    () => largeScreenDevicePointsApi.getRealTimeDevicePointsList(),
    {
      manual: true,
      onError(e) {
        message.error(JSON.stringify(e));
      },
    },
  );
  /** 查询所有(配置)点位信息 */
  const { run: queryAllDevicePointsList, data: allDevicePointsList } = useRequest(
    () => largeScreenDevicePointsApi.getAllDevicePointsList(),
    {
      manual: true,
      onError(e) {
        message.error(JSON.stringify(e));
      },
    },
  );
  /** 更新所有(配置)点位信息 */
  const { run: postAllDevicePointsList } = useRequest(
    (params) => largeScreenDevicePointsApi.postAllDevicePointsList(params),
    {
      manual: true,
      onError(e) {
        message.error(JSON.stringify(e));
      },
      onSuccess() {
        message.success("操作成功！");
        queryAllDevicePointsList();
      },
    },
  );

  /** 删除所有(配置)点位信息 */
  const { run: deleteAllDevicePointsList } = useRequest(
    () => largeScreenDevicePointsApi.deleteAllDevicePointsList(),
    {
      manual: true,
      onError(e) {
        message.error(JSON.stringify(e));
      },
      onSuccess() {
        message.success("操作成功！");
        queryAllDevicePointsList();
      },
    },
  );
  /** 添加点位信息 */
  const { run: addOneDevicePoint } = useRequest(
    (params) => largeScreenDevicePointsApi.oneDevicePoint(params),
    {
      manual: true,
      onSuccess() {
        message.success("添加成功！");
        queryAllDevicePointsList();
      },
      onError(e) {
        message.error(JSON.stringify(e));
      },
    },
  );

  /** 更新点位信息 */
  const { run: updateOneDevicePoint } = useRequest(
    (params) => largeScreenDevicePointsApi.updateOneDevicePoint(params),
    {
      manual: true,
      onSuccess() {
        message.success("更新成功！");
        queryAllDevicePointsList();
      },
      onError(e) {
        message.error(JSON.stringify(e));
      },
    },
  );

  /** 更新点位信息 */
  const { run: deleteDevicePoints } = useRequest(
    (id) => {
      return largeScreenDevicePointsApi.deleteDevicePointsById(id);
    },
    {
      manual: true,
      onSuccess() {
        message.success("删除成功！");
        queryAllDevicePointsList();
      },
      onError(e) {
        message.error(JSON.stringify(e));
      },
    },
  );

  const addOrUpdateOneDevicePoint = async (params: pointInfoType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isTempId(params.pointId) ? addOneDevicePoint(params) : updateOneDevicePoint(params);
  };
  const deleteDevicePointsById = (id: string) => {
    if (isTempId(id)) return;
    deleteDevicePoints(id);
  };

  const newRealTimeDevicePointsList = useMemo(() => {
    return realTimeDevicePointsList;
  }, [realTimeDevicePointsList]);

  const newAllDevicePointsList = useMemo(() => {
    return allDevicePointsList;
  }, [allDevicePointsList]);

  return {
    /** 删除所有点位 */
    deleteAllDevicePointsList,
    /** 批量添加点位 */
    postAllDevicePointsList,
    /** 自己判断添加或更新一个点位 */
    addOrUpdateOneDevicePoint,
    /** 添加一个点位 */
    addOneDevicePoint,
    /** 更新一个点位 */
    updateOneDevicePoint,
    /** 查询所有点位信息 */
    queryAllDevicePointsList,
    /** 删除点位信息 */
    deleteDevicePointsById,
    allDevicePointsList: newAllDevicePointsList,
    /** 查询实时点位信息 */
    queryRealTimeDevicePointsList,
    /** 实时点位信息 */
    realTimeDevicePointsList: newRealTimeDevicePointsList,
    /** 格式化数据 */
    // transformDevicePointsList,
  };
};
