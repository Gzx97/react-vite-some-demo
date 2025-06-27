/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from "lodash";
import { POINT_TYPE, pointInfoType } from "../../components/DispatchView";
import { isTempId } from "../../utils/generateUniqueId";
import BaseApi from "../base.api";

export const transformPointInfoData = (params: pointInfoType) => {
  const newParams = {
    ...params,
    id: isTempId(params?.pointId) ? null : params?.pointId, //id中有「point」的为前端生成的临时id，不传给后端
    pointPosition: {
      positionX: params?.positionX,
      positionY: params?.positionY,
    },
    stagingAreaInfo:
      params?.pointType === POINT_TYPE.STORAGE_CACHE
        ? {
            width: params?.width,
            height: params?.height,
          }
        : {},
    directionInfo: params?.directionInfo.map((item) => {
      return {
        ...item,
        id: item?.lineId,
      };
    }),
  };

  return _.omit(newParams, ["pointId", "positionX", "positionY"]);
};

class LargeScreenDevicePointsApi extends BaseApi {
  private baseUrl = "/backend/device/device-points";

  /** 保存模板信息 批量*/
  postAllDevicePointsList(params: any[]) {
    return Promise.resolve(undefined);
  }

  /** 删除模板信息 批量*/
  deleteAllDevicePointsList() {
    return Promise.resolve(undefined);
  }
  /** 保存模板信息 单条*/
  oneDevicePoint(params: pointInfoType) {
    return Promise.resolve(undefined);
  }
  /** 更新模板信息 单条*/
  updateOneDevicePoint(params: pointInfoType) {
    return Promise.resolve(undefined);
  }

  /** 根据id删除 */
  deleteDevicePointsById(id: string) {
    return Promise.resolve(undefined);
  }
  /** 查询所有 */
  getAllDevicePointsList(): Promise<any> {
    return Promise.resolve(undefined);
  }

  /** 查询实时 */
  getRealTimeDevicePointsList(): Promise<any> {
    return Promise.resolve(undefined);
  }
  /** 根据id查询 */
  getDevicePointsById(id: string) {
    return Promise.resolve(undefined);
  }
}

export default LargeScreenDevicePointsApi;
