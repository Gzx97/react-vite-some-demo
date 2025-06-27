import { AxiosInstance } from "axios";
import ajax from "./ajax";

class BaseApi {
  protected request: AxiosInstance;
  constructor() {
    this.request = ajax;
  }
}
export default BaseApi;
