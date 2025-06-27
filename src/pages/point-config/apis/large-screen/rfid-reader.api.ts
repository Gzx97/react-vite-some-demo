import BaseApi from "../base.api";

export type RfidReadersOfflineListType = {
  id: string;
  sn: string;
  name: string;
  onlineStatus: string;
};

class LargeScreenRfidReaderApi extends BaseApi {
  /** 查询离线天线*/
  rfidReadersOfflineList(): Promise<RfidReadersOfflineListType[]> {
    return Promise.resolve([]);
  }
  listAll() {
    return Promise.resolve(undefined);
  }
}

export default LargeScreenRfidReaderApi;
