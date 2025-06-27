import { FC, useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { Button, Form, Popconfirm, Space } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { largeScreenRfidReaderApi } from "../apis/large-screen";
import { ONLINE_STATUS } from "../constant";
import { usePointInfoRequest } from "../hooks/usePointInfoRequest";
import { generateUniqueId } from "../utils/generateUniqueId";
import { isNilEmpty } from "../utils/isNilEmpty";
import DispatchImgView from "./DispatchImgView";
import styles from "./DispatchView.module.less";
import PointConfigDrawer from "./PointConfigDrawer";
import ScaleLayout from "./ScaleLayout";

export type LineTransformInfoType = {
  /** 横坐标（） */
  positionX: number;
  /** 纵坐标 （）*/
  positionY: number;
  /** 旋转角度 */
  angle: number;
  /** 线段名称 */
  lineName: string;
  /** ID */
  lineId: string;
  id?: string;
  /** 小球数量 */
  ballNumber?: number;
  /** 上一个点位id */
  prevPointId?: number;
  /** 如果该点位用来监测暂存区 关联暂存区id */
  relativeStagingAreaId?: string;
  /** 资产信息 */
  assets?: any[];
};
/** 天线点位类型 */
export enum POINT_TYPE {
  /**天线 */
  ANTENNA = "RFID_READER",
  /** 暂存区 */
  STORAGE_CACHE = "STAGING_AREA",
}
/** 天线点位信息 */
export type pointInfoType = {
  pointName: string;
  pointId: string;
  /** 关联设备编号 */
  curRealtiveDeviceSn?: string;
  positionX: number;
  positionY: number;
  /** 天线点位类型 */
  pointType?: POINT_TYPE;
  /** xxx点位位置信息 */
  directionInfo: LineTransformInfoType[];
  realtiveDeviceOnlineStatus?: ONLINE_STATUS;
} & Partial<StorageCacheInfoType>;
/** 暂存区点位信息 */
export type StorageCacheInfoType = {
  width: number;
  height: number;
};
export type DispatchViewType = {
  readonly?: boolean;
  wrapperSize?: {
    width: number;
    height: number;
  };
};
const DispatchView: FC<DispatchViewType> = ({ wrapperSize, readonly }) => {
  const [form] = Form.useForm();
  const [pointConfigOpen, setPointConfigOpen] = useState(false);
  const [pointConfigIndex, setPointConfigIndex] = useState<number>(); //天线点位索引
  const [pointInfo, setPointInfo] = useState<pointInfoType[]>([]);
  const { queryAllDevicePointsList, allDevicePointsList, deleteAllDevicePointsList } = usePointInfoRequest();
  /** 打开天线点位配置抽屉 */
  const showPointConfigDrawer = (index?: number) => {
    setPointConfigIndex(index);
    setPointConfigOpen(true);
  };
  const onClose = () => {
    setPointConfigOpen(false);
    // setPointConfigIndex(undefined);
  };

  /** 获取所有天线信息 */
  const { data: rfidReaderSnList } = useRequest(() => largeScreenRfidReaderApi.listAll());

  const rfidReaderSnOptions: DefaultOptionType[] = useMemo(() => {
    if (isNilEmpty(rfidReaderSnList)) return [];
    return (rfidReaderSnList as any)?.map((item: any) => {
      return {
        label: item?.name,
        value: item?.sn,
        ...item,
      };
    });
  }, [rfidReaderSnList]);

  /** 更新天线点位信息 */
  const updateAntennaPointInfo = (pointId: string, value: Partial<pointInfoType>) => {
    const newData = pointInfo?.map((item) => {
      if (item.pointId === pointId) {
        return {
          ...item,
          ...value,
        };
      }
      return { ...item };
    });
    setPointInfo(newData);
    form.setFieldsValue({
      pointInfo: newData,
    });
    return newData;
  };
  /** 更新天线的xxx点位车队信息 */
  const updateAntennaPointLineInfo = (
    pointId: string,
    lineId: string | number,
    lineValue?: Partial<LineTransformInfoType>,
  ) => {
    const newData = pointInfo?.map((antennaPointItem) => {
      if (antennaPointItem.pointId === pointId) {
        return {
          ...antennaPointItem,
          directionInfo: antennaPointItem?.directionInfo
            ?.filter((fItem) => {
              //传入lineValue为空的时候删除该项
              return !(isNilEmpty(lineValue) && fItem.lineId === lineId);
            })
            ?.map((item) => {
              if (item.lineId === lineId) {
                return { ...item, ...lineValue };
              }
              return { ...item };
            }),
        };
      }
      return { ...antennaPointItem };
    });
    setPointInfo(newData);
    form.setFieldsValue({
      pointInfo: newData,
    });
    return newData;
  };

  const handleAddOnePoint = (pointType: POINT_TYPE, positionX?: number, positionY?: number) => {
    const formData = (form.getFieldValue("pointInfo") as pointInfoType[]) ?? [];
    const defaultData = {
      pointName: "未命名点位",
      pointId: generateUniqueId("point"),
      positionX: positionX ?? 100,
      positionY: positionY ?? 100,
      pointType: pointType,
      width: 100,
      height: 100,
      directionInfo: [],
    } as pointInfoType;
    const newData = [...formData, defaultData];
    form.setFieldsValue({
      pointInfo: newData,
    });
    setPointInfo(newData);
  };
  useEffect(() => {
    queryAllDevicePointsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    form.setFieldsValue({ pointInfo: allDevicePointsList });
    setPointInfo(allDevicePointsList);
  }, [allDevicePointsList, form]);
  return (
    <div className={styles["wrapper"]}>
      <Form
        form={form}
        className={styles["formWrapper"]}
        initialValues={{
          /** 天线点位 */
          pointInfo: pointInfo,
        }}
      >
        <ScaleLayout width={wrapperSize?.width} height={wrapperSize?.height}>
          <div className={styles["largeWrapper"]}>
            <div className={styles["buttonWrapper"]}>
              <div>
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddOnePoint(POINT_TYPE.ANTENNA);
                    }}
                  >
                    添加天线点位
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddOnePoint(POINT_TYPE.STORAGE_CACHE);
                    }}
                  >
                    添加暂存区点位
                  </Button>
                  <Popconfirm
                    title="确认清空？"
                    onConfirm={() => {
                      deleteAllDevicePointsList();
                    }}
                  >
                    <Button type="primary" danger>
                      清空所有点位
                    </Button>
                  </Popconfirm>

                  {/* <Button
                    type="primary"
                    onClick={() => {
                      showPointConfigDrawer();
                    }}
                  >
                    打开所有点位配置菜单
                  </Button> */}
                </Space>
              </div>
            </div>
            <DispatchImgView
              form={form}
              updateAntennaPointLineInfo={updateAntennaPointLineInfo}
              antennaPointInfo={pointInfo}
              updateAntennaPointInfo={updateAntennaPointInfo}
              openPointDrawer={showPointConfigDrawer}
              readonly={readonly}
              onChangeAllDevicePointsList={(value) => {
                form.setFieldsValue({ pointInfo: value });
                setPointInfo(value);
              }}
            />
          </div>
        </ScaleLayout>
        <PointConfigDrawer
          updateAntennaPointLineInfo={updateAntennaPointLineInfo}
          updateAntennaPointInfo={updateAntennaPointInfo}
          antennaPointInfo={pointInfo}
          setAntennaPointInfo={(v: pointInfoType[]) => {
            setPointInfo(v);
          }}
          open={pointConfigOpen}
          form={form}
          onClose={onClose}
          pointConfigIndex={pointConfigIndex}
          rfidReaderSnOptions={rfidReaderSnOptions}
        />
      </Form>
    </div>
  );
};
export default DispatchView;
