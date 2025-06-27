import React, { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, FormInstance, Input, InputNumber, Select, Slider } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { usePointInfoRequest } from "../hooks/usePointInfoRequest";
import { generateUniqueId, isTempId } from "../utils/generateUniqueId";
import { isNilEmpty } from "../utils/isNilEmpty";
import { LineTransformInfoType, POINT_TYPE, pointInfoType } from "./DispatchView";
import styles from "./DispatchView.module.less";

export type ConfigRefType = {
  [key: string]: any;
};
export type PointConfigDrawerType = {
  updateAntennaPointLineInfo: (
    pointId: string,
    lineId: string | number,
    lineValue?: Partial<LineTransformInfoType>,
  ) => pointInfoType[];
  updateAntennaPointInfo: (pointId: string, value: Partial<pointInfoType>) => pointInfoType[];
  antennaPointInfo: pointInfoType[];
  setAntennaPointInfo: (value: pointInfoType[]) => void;
  open: boolean;
  form: FormInstance<any>;
  onClose: () => void;
  /** 单独编辑FormList的某一项 */
  pointConfigIndex?: number;
  /** 天线设备options */
  rfidReaderSnOptions?: DefaultOptionType[];
};

// const PointConfigDrawer = forwardRef<ConfigRefType, PointConfigDrawerType>(

// );
const PointConfigDrawer: React.FC<PointConfigDrawerType> = ({
  updateAntennaPointLineInfo,
  updateAntennaPointInfo,
  antennaPointInfo,
  setAntennaPointInfo,
  open,
  form,
  onClose,
  pointConfigIndex,
  rfidReaderSnOptions,
}) => {
  const { addOrUpdateOneDevicePoint, deleteDevicePointsById, allDevicePointsList } = usePointInfoRequest();

  useEffect(() => {
    form.setFieldsValue({ pointInfo: allDevicePointsList });
    setAntennaPointInfo(allDevicePointsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDevicePointsList]);

  return (
    <Drawer
      title="点位配置"
      placement="right"
      width={500}
      open={open}
      onClose={onClose}
      extra={
        <Button
          onClick={async () => {
            if (!isNilEmpty(pointConfigIndex)) {
              const data = form.getFieldValue(["pointInfo", pointConfigIndex]);
              await addOrUpdateOneDevicePoint?.(data);
              onClose?.();
            }
          }}
          type="primary"
        >
          提交
        </Button>
      }
    >
      <div className={styles["pointConfigWrapper"]}>
        <Form.List name="pointInfo">
          {(pointInfoFields, { remove: removePoint }) => {
            const allPointInfoData = form.getFieldValue("pointInfo");
            const allPointOptions = allPointInfoData
              ?.filter((item: pointInfoType) => {
                return item?.pointType !== POINT_TYPE.STORAGE_CACHE;
              })
              ?.map((pointItem: pointInfoType) => {
                return {
                  value: pointItem?.pointId,
                  label: pointItem?.pointName,
                };
              });

            const allStorageCacheOptions = allPointInfoData
              ?.filter((item: pointInfoType) => {
                return item?.pointType === POINT_TYPE.STORAGE_CACHE;
              })
              ?.map((pointItem: pointInfoType) => {
                return {
                  value: pointItem?.pointId,
                  label: pointItem?.pointName,
                };
              });
            return (
              <>
                {pointInfoFields.map(({ name: pointListName, key: pointKey }) => {
                  const currentPointValue = form.getFieldValue(["pointInfo", pointListName]);
                  const pointId = currentPointValue?.pointId;
                  /** 上一个点位不能是当前点位 */
                  const pointOptions = allPointOptions?.map((option: DefaultOptionType) => {
                    return {
                      ...option,
                      disabled: currentPointValue?.pointId === option?.value,
                    };
                  });
                  /** 只展示单个点位的配置 */
                  if (pointConfigIndex === pointListName || pointConfigIndex === undefined) {
                    return (
                      <div className={styles["pointConfigItemWrapper"]} key={pointKey}>
                        <div className={styles["pointFormInfo"]}>
                          <Form.Item label="点位类型" name={[pointListName, "pointType"]}>
                            <Select
                              style={{ width: 150 }}
                              options={[
                                {
                                  label: "监控点位",
                                  value: POINT_TYPE.ANTENNA,
                                },
                                {
                                  label: "暂存点位",
                                  value: POINT_TYPE.STORAGE_CACHE,
                                },
                              ]}
                              onChange={(v) => {
                                updateAntennaPointInfo(pointId, {
                                  pointType: v,
                                  curRealtiveDeviceSn: undefined,
                                  directionInfo: [],
                                  width: 100,
                                  height: 100,
                                });
                              }}
                            />
                          </Form.Item>
                          <Form.Item label="点位ID" name={[pointListName, "pointId"]}>
                            <Input disabled style={{ width: 200 }} />
                          </Form.Item>

                          <Form.Item label="点位名称" name={[pointListName, "pointName"]}>
                            <Input
                              style={{ width: 150 }}
                              onChange={(v) => {
                                updateAntennaPointInfo(pointId, {
                                  pointName: v.target.value,
                                });
                              }}
                            />
                          </Form.Item>

                          {/* X坐标（） */}
                          <Form.Item name={[pointListName, "positionX"]} label="点位X坐标">
                            <InputNumber
                              style={{ width: 150 }}
                              addonAfter="px"
                              onChange={(v) => {
                                updateAntennaPointInfo(pointId, {
                                  positionX: v as number,
                                });
                              }}
                            />
                          </Form.Item>
                          {/* Y坐标（） */}
                          <Form.Item name={[pointListName, "positionY"]} label="点位Y坐标">
                            <InputNumber
                              style={{ width: 150 }}
                              addonAfter="px"
                              onChange={(v) => {
                                updateAntennaPointInfo(pointId, {
                                  positionY: v as number,
                                });
                              }}
                            />
                          </Form.Item>
                          {/* 类型切换选择不同的配置信息 */}
                          <Form.Item noStyle dependencies={[[pointListName, "pointType"]]}>
                            {({ getFieldValue }) => {
                              const pointType = getFieldValue(["pointInfo", pointListName, "pointType"]);
                              const allData = getFieldValue("pointInfo");
                              /** 已经被绑定的设备id */
                              const usedCurRealtiveDeviceSns = allData
                                ?.map((item: pointInfoType) => {
                                  if (!isTempId(item?.pointId)) {
                                    return item?.curRealtiveDeviceSn;
                                  }
                                  return null;
                                })
                                .filter(Boolean);

                              if (pointType === POINT_TYPE.STORAGE_CACHE) {
                                return (
                                  <>
                                    <Form.Item name={[pointListName, "width"]} label="暂存区宽度">
                                      <Slider
                                        style={{ width: 200 }}
                                        max={500}
                                        min={5}
                                        step={1}
                                        tooltip={{ open: false }}
                                        onChange={(v) => {
                                          updateAntennaPointInfo(pointId, {
                                            width: v,
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item name={[pointListName, "height"]} label="暂存区高度">
                                      <Slider
                                        style={{ width: 200 }}
                                        max={500}
                                        min={5}
                                        step={1}
                                        tooltip={{ open: false }}
                                        onChange={(v) => {
                                          updateAntennaPointInfo(pointId, {
                                            height: v,
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                  </>
                                );
                              }
                              if (pointType === POINT_TYPE.ANTENNA) {
                                return (
                                  <>
                                    <Form.Item label="设备" name={[pointListName, "curRealtiveDeviceSn"]}>
                                      <Select
                                        style={{ width: 200 }}
                                        options={rfidReaderSnOptions?.map((item) => {
                                          return {
                                            ...item,
                                            disabled: usedCurRealtiveDeviceSns?.includes(item.value),
                                          };
                                        })}
                                        onChange={(v) => {
                                          updateAntennaPointInfo(pointId, {
                                            curRealtiveDeviceSn: v,
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                  </>
                                );
                              }
                            }}
                          </Form.Item>
                        </div>
                        <Form.Item dependencies={[pointListName, "pointType"]} noStyle>
                          {({ getFieldValue }) => {
                            /** 暂存区不配置方向信息 */
                            const showDirectionInfo =
                              getFieldValue(["pointInfo", pointListName, "pointType"]) === POINT_TYPE.ANTENNA;
                            if (showDirectionInfo) {
                              return (
                                <Form.List name={[pointListName, "directionInfo"]}>
                                  {(lineInfoFields, { add: addLineInfo, remove: removeLineInfo }) => {
                                    return (
                                      <div className={styles["lineConfigWrapper"]}>
                                        <h3 className={styles["lineConfigTitle"]}>
                                          每组xxx点位车的位置角度配置
                                        </h3>
                                        {lineInfoFields.map(({ name: lineName, key }) => {
                                          const currentLineValue = form.getFieldValue([
                                            "pointInfo",
                                            pointListName,
                                            "directionInfo",
                                            lineName,
                                          ]);
                                          const lineId = currentLineValue?.lineId;
                                          return (
                                            <div className={styles["formRowWrapper"]} key={key}>
                                              {/* 线段ID */}
                                              <Form.Item name={[lineName, "lineId"]} label="lineId">
                                                <Input disabled style={{ width: 200 }} />
                                              </Form.Item>
                                              <Form.Item label="上一个点位" name={[lineName, "prevPointId"]}>
                                                <Select
                                                  style={{ width: 120 }}
                                                  options={pointOptions}
                                                  onChange={(v) => {
                                                    updateAntennaPointLineInfo(pointId, lineId, {
                                                      prevPointId: v,
                                                    });
                                                  }}
                                                />
                                              </Form.Item>

                                              <Form.Item
                                                label="关联暂存区点位"
                                                name={[lineName, "relativeStagingAreaId"]}
                                              >
                                                <Select
                                                  style={{ width: 120 }}
                                                  options={allStorageCacheOptions}
                                                  allowClear
                                                  onChange={(v) => {
                                                    updateAntennaPointLineInfo(pointId, lineId, {
                                                      relativeStagingAreaId: v,
                                                    });
                                                  }}
                                                />
                                              </Form.Item>
                                              {/* 旋转角度 */}
                                              <div className={styles["sliderWrapper"]}>
                                                <Form.Item name={[lineName, "angle"]} label="旋转角度">
                                                  <Slider
                                                    max={360}
                                                    min={0}
                                                    step={0.1}
                                                    tooltip={{
                                                      open: false,
                                                    }}
                                                    onChange={(v) => {
                                                      updateAntennaPointLineInfo(pointId, lineId, {
                                                        angle: v,
                                                      });
                                                    }}
                                                  />
                                                </Form.Item>
                                                <Form.Item name={[lineName, "angle"]} label="旋转角度">
                                                  <InputNumber
                                                    style={{ width: 120 }}
                                                    addonAfter="deg"
                                                    onChange={(v) => {
                                                      updateAntennaPointLineInfo(pointId, lineId, {
                                                        angle: v as number,
                                                      });
                                                    }}
                                                  />
                                                </Form.Item>
                                              </div>
                                              {/* X坐标（） */}
                                              <Form.Item name={[lineName, "positionX"]} label="X坐标">
                                                <InputNumber
                                                  style={{ width: 120 }}
                                                  addonAfter="px"
                                                  onChange={(v) => {
                                                    updateAntennaPointLineInfo(pointId, lineId, {
                                                      positionX: v as number,
                                                    });
                                                  }}
                                                />
                                              </Form.Item>
                                              {/* Y坐标（） */}
                                              <Form.Item name={[lineName, "positionY"]} label="Y坐标">
                                                <InputNumber
                                                  style={{ width: 120 }}
                                                  addonAfter="px"
                                                  onChange={(v) => {
                                                    updateAntennaPointLineInfo(pointId, lineId, {
                                                      positionY: v as number,
                                                    });
                                                  }}
                                                />
                                              </Form.Item>
                                              {/* 线段名称 */}
                                              {/* <Form.Item
                                            name={[lineName, "lineName"]}
                                            label="车队名称"
                                          >
                                            <Input
                                              style={{ width: 120 }}
                                              onChange={(v) => {
                                                updateAntennaPointLineInfo(
                                                  pointId,
                                                  lineId,
                                                  {
                                                    lineName: v.target.value,
                                                  }
                                                );
                                              }}
                                            />
                                          </Form.Item> */}
                                              {/* 小球数量（调试用） */}
                                              {/* <Form.Item
                                          name={[lineName, "ballNumber"]}
                                          label="小球数量(调试)"
                                        >
                                          <InputNumber
                                            style={{ width: 120 }}
                                            onChange={(v) => {
                                              updateAntennaPointLineInfo(
                                                pointId,
                                                lineId,
                                                {
                                                  ballNumber: v as number,
                                                }
                                              );
                                            }}
                                          />
                                        </Form.Item> */}

                                              {/* 删除 */}
                                              <MinusCircleOutlined
                                                className={styles["dynamicDeleteButton"]}
                                                onClick={() => {
                                                  removeLineInfo(lineName);
                                                  updateAntennaPointLineInfo(pointId, lineId, {});
                                                }}
                                              />
                                            </div>
                                          );
                                        })}
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            const newAntennaPointInfo = _.cloneDeep(antennaPointInfo);
                                            const defaultNewData = {
                                              positionX: newAntennaPointInfo?.[pointListName]?.positionX,
                                              positionY: newAntennaPointInfo?.[pointListName]?.positionY,
                                              angle: 0,
                                              lineId: generateUniqueId("line"),
                                              ballNumber: 3,
                                            };

                                            _.set(
                                              newAntennaPointInfo,
                                              [pointListName, "directionInfo"],
                                              [
                                                ..._.get(newAntennaPointInfo, [
                                                  pointListName,
                                                  "directionInfo",
                                                ]),
                                                defaultNewData,
                                              ],
                                            );
                                            setAntennaPointInfo(newAntennaPointInfo);
                                            addLineInfo(defaultNewData);
                                          }}
                                          style={{ width: 200 }}
                                          icon={<PlusOutlined />}
                                        >
                                          添加一组xxx点位配置信息
                                        </Button>
                                      </div>
                                    );
                                  }}
                                </Form.List>
                              );
                            }

                            return null;
                          }}
                        </Form.Item>

                        {/* 删除点位 */}
                        <Button
                          onClick={() => {
                            const newAntennaPointInfo = _.cloneDeep(antennaPointInfo);
                            onClose();
                            deleteDevicePointsById(newAntennaPointInfo[pointListName].pointId);
                            newAntennaPointInfo.splice(pointListName, 1);
                            setAntennaPointInfo(newAntennaPointInfo);
                            removePoint(pointListName);
                          }}
                          style={{
                            width: "100%",
                            marginTop: 20,
                            color: "red",
                          }}
                          icon={<MinusCircleOutlined className="dynamic-delete-button" />}
                        >
                          删除点位
                        </Button>
                      </div>
                    );
                  }
                  return null;
                })}
                {/* <Button
                  type="dashed"
                  onClick={() => {
                    const defaultValue = {
                      pointName: `天线${pointInfoFields.length}`,
                      pointId: generateUniqueId("point"),
                      positionX: 0,
                      positionY: 0,
                      directionInfo: [
                        {
                          positionX: 0,
                          positionY: 0,
                          angle: 0,
                          lineName: `线段${0}`,
                          lineId: generateUniqueId("line"),
                          ballNumber: 2,
                        },
                      ],
                    } as AntennaPointInfoType;
                    setAntennaPointInfo([...antennaPointInfo, defaultValue]);
                    addPoint(defaultValue);
                  }}
                  style={{ width: 400, marginTop: 20 }}
                  icon={<PlusOutlined />}
                >
                  添加点位
                </Button> */}
              </>
            );
          }}
        </Form.List>
      </div>
    </Drawer>
  );
};
export default React.memo(PointConfigDrawer);
