/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseApi from "../base.api";

export type putAssetType = {
  assetId: string;
  torpedoCarWeightStatus: string;
};

class LargeScreenAssetApi extends BaseApi {
  /** 更新资产信息*/
  updateAssetsStatus(params: putAssetType): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export default LargeScreenAssetApi;
