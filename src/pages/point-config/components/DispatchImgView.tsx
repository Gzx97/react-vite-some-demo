import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Form, FormInstance, InputNumber, Popover, Select, Slider, Space, Tooltip } from "antd";
import classNames from "classnames";
import { ONLINE_STATUS } from "../constant";
import { usePointInfoRequest } from "../hooks/usePointInfoRequest";
import * as Icons from "../images";
import BG_IMG from "../images/dispatch-bg-img-no-text.jpg";
import BG_IMG_NO_TEXT from "../images/dispatch-bg-img-no-text.jpg";
import { isNilEmpty } from "../utils/isNilEmpty";
import { BallPopoverMenu } from "./BallPopoverMenu";
import styles from "./DispatchImgView.module.less";
import { LineTransformInfoType, POINT_TYPE, pointInfoType } from "./DispatchView";
import DraggableResizableBox from "./DraggableResizableBox";
import DragRotateBox from "./DragRotateBox";
import { StorageCacheDetail } from "./StorageCacheDetail";

/** xxx点位状态 */
export enum BALL_STATUS {
  /** 未知 */
  UNKNOWN = "UNKNOWN",
  /** 满罐 */
  FULL = "FULL",
  /** 空罐 */
  EMPTY = "EMPTY",
}

/** 资产类型 */
export enum BALL_TYPE {
  /** 车 */
  TRAIN = "TRAIN",
  /** xxx点位 */
  IRON_LADLE = "IRON_LADLE",
}
export const BallStatusConfig = {
  [BALL_STATUS.UNKNOWN]: {
    text: "未知",
    value: BALL_STATUS.UNKNOWN,
  },
  [BALL_STATUS.EMPTY]: {
    text: "空包",
    value: BALL_STATUS.EMPTY,
  },
  [BALL_STATUS.FULL]: {
    text: "重包",
    value: BALL_STATUS.FULL,
  },
};

export type DispatchImgViewType = {
  /** 打开天线单点配置菜单 */
  openPointDrawer?: (pathName?: number) => void;
  form?: FormInstance<any>;
  updateAntennaPointLineInfo?: (
    pointId: string,
    lineId: string | number,
    lineValue?: Partial<LineTransformInfoType>,
  ) => pointInfoType[];
  antennaPointInfo: pointInfoType[];
  updateAntennaPointInfo?: (pointId: string, value: Partial<pointInfoType>) => pointInfoType[];
  readonly?: boolean;
  showRfid?: boolean;
  showRouteName?: boolean;
  searchValue?: string;
  onChangeAllDevicePointsList?: (value: pointInfoType[]) => void;
};
const DispatchImgView: FC<DispatchImgViewType> = ({
  form,
  updateAntennaPointLineInfo,
  antennaPointInfo,
  updateAntennaPointInfo,
  openPointDrawer,
  readonly,
  showRfid = true,
  showRouteName = true,
  searchValue,
  onChangeAllDevicePointsList,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerInfo, setContainerInfo] = useState({
    width: 1,
    height: 1,
  }); //容器长宽，用来计算位移的比例
  const { addOrUpdateOneDevicePoint, allDevicePointsList } = usePointInfoRequest();
  useEffect(() => {
    onChangeAllDevicePointsList?.(allDevicePointsList);
  }, [allDevicePointsList]);
  // 同步获取容器宽高
  useLayoutEffect(() => {
    setContainerInfo({
      width: containerRef?.current?.offsetWidth || 1,
      height: containerRef?.current?.offsetHeight || 1,
    });
  }, []);

  /** 获取表单的pathName */
  const getPathName = (pointIndex: number, lineIndex: number, name: string) => {
    return ["pointInfo", pointIndex, "directionInfo", lineIndex, name];
  };

  const getPointOptions = (currentPointId: string) => {
    return antennaPointInfo?.map((item) => {
      return {
        label: item?.pointName,
        value: item?.pointId,
        disabled: item?.pointId === currentPointId,
      };
    });
  };
  const renderBall = (status: BALL_STATUS, hasDirection: boolean = true) => {
    switch (status) {
      case BALL_STATUS.FULL:
        return (
          <div className={classNames({ [styles.unknownDirection]: !hasDirection })}>
            <div className={classNames(styles["ball"], styles["fullBall"])} />
          </div>
        );
      case BALL_STATUS.EMPTY:
        return (
          <div className={classNames({ [styles.unknownDirection]: !hasDirection })}>
            <div className={classNames(styles["ball"], styles["emptyBall"])} />
          </div>
        );
      case BALL_STATUS.UNKNOWN:
        return (
          <div
            style={{
              width: "15px",
              height: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={classNames({ [styles.unknownDirection]: !hasDirection })}
          >
            <Icons.Unknown style={{ fontSize: 15 }} />
          </div>
        );

      default:
        break;
    }
  };
  return (
    <div
      ref={containerRef}
      className={classNames(styles["imgBox"], {
        [styles.readonlyImgBox]: readonly,
        /**
         * @description 为了在配置页面留白少一点 根据1920(1623)*1080(912)算出来同比放大
         *  transform: scaleX(1920/1623) scaleY(1080/912);
         *  transform-origin: top left;
         */
        [styles.configImgBox]: !readonly,
      })}
      onDragOver={(e) => {
        //禁用掉使用draggable做拖拽的回弹动
        e.preventDefault();
      }}
    >
      <img
        className={classNames(styles.img)}
        src={showRouteName ? BG_IMG : BG_IMG_NO_TEXT}
        draggable={false}
        style={{ width: 1623, height: 912 }}
        alt=""
      />

      {/* 点位坐标信息*/}
      {antennaPointInfo?.map((antennaPointItem, antennaPointIndex) => {
        /** (天线)监控点位 */
        if (antennaPointItem.pointType === POINT_TYPE.ANTENNA && showRfid) {
          return (
            <DragRotateBox
              key={antennaPointItem.pointId}
              containerInfo={containerInfo}
              position={{
                x: antennaPointItem.positionX,
                y: antennaPointItem.positionY,
              }}
              onPositionChange={(positionInfo) => {
                const newData =
                  updateAntennaPointInfo?.(antennaPointItem.pointId, {
                    positionX: positionInfo.x,
                    positionY: positionInfo.y,
                  }) ?? [];
                form?.setFieldsValue({ pointInfo: [...newData] });
              }}
              readonly={readonly}
            >
              {!readonly && (
                <Popover
                  trigger="contextMenu"
                  title="单个点位设置"
                  styles={{
                    body: {
                      opacity: 0.8,
                    },
                  }}
                  content={
                    <>
                      <Form.Item label="positionX" name={["pointInfo", antennaPointIndex, "positionX"]}>
                        <InputNumber
                          onChange={(v) => {
                            updateAntennaPointInfo?.(antennaPointItem.pointId, {
                              positionX: v as number,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="positionY" name={["pointInfo", antennaPointIndex, "positionY"]}>
                        <InputNumber
                          onChange={(v) => {
                            updateAntennaPointInfo?.(antennaPointItem.pointId, {
                              positionY: v as number,
                            });
                          }}
                        />
                      </Form.Item>
                      <Space>
                        <Button
                          onClick={() => {
                            openPointDrawer?.(antennaPointIndex);
                          }}
                          type="dashed"
                        >
                          打开配置菜单
                        </Button>
                        <Button
                          onClick={() => {
                            addOrUpdateOneDevicePoint?.(antennaPointItem);
                          }}
                          type="primary"
                        >
                          提交
                        </Button>
                      </Space>
                    </>
                  }
                >
                  <Icons.Position />
                  <span>{antennaPointItem.pointName}</span>
                </Popover>
              )}
              {readonly && (
                <>
                  <Icons.Position
                    style={
                      antennaPointItem?.realtiveDeviceOnlineStatus === ONLINE_STATUS.OFFLINE
                        ? { color: "#F70000" }
                        : {}
                    }
                  />
                  {antennaPointItem?.pointName}
                </>
              )}
            </DragRotateBox>
          );
        }
        /** 暂存点位 */
        if (antennaPointItem.pointType === POINT_TYPE.STORAGE_CACHE) {
          return (
            <div key={antennaPointItem.pointId}>
              <DraggableResizableBox
                onPositionChange={(positionInfo) => {
                  const newData =
                    updateAntennaPointInfo?.(antennaPointItem.pointId, {
                      positionX: positionInfo.x,
                      positionY: positionInfo.y,
                    }) ?? [];
                  form?.setFieldsValue({ pointInfo: [...newData] });
                }}
                position={{
                  x: antennaPointItem?.positionX,
                  y: antennaPointItem?.positionY,
                }}
                size={{
                  width: antennaPointItem.width ?? 10,
                  height: antennaPointItem.height ?? 10,
                }}
              >
                {!readonly && (
                  <Popover
                    trigger="contextMenu"
                    overlayInnerStyle={{ opacity: 0.8 }}
                    title="暂存区设置"
                    content={
                      <>
                        <Form.Item label="宽度" name={["pointInfo", antennaPointIndex, "width"]}>
                          <Slider
                            style={{ width: 200 }}
                            max={500}
                            min={5}
                            step={1}
                            tooltip={{ open: false }}
                            onChange={(v) => {
                              updateAntennaPointInfo?.(antennaPointItem.pointId, {
                                width: v,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item label="高度" name={["pointInfo", antennaPointIndex, "height"]}>
                          <Slider
                            style={{ width: 200 }}
                            max={500}
                            min={5}
                            step={1}
                            tooltip={{ open: false }}
                            onChange={(v) => {
                              updateAntennaPointInfo?.(antennaPointItem.pointId, {
                                height: v,
                              });
                            }}
                          />
                        </Form.Item>
                        <Space>
                          <Button
                            type="dashed"
                            onClick={() => {
                              openPointDrawer?.(antennaPointIndex);
                            }}
                          >
                            打开配置菜单
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => {
                              addOrUpdateOneDevicePoint(antennaPointItem);
                            }}
                          >
                            提交
                          </Button>
                        </Space>
                      </>
                    }
                  >
                    <div className={styles["storageCacheNameBox"]}>
                      {antennaPointItem?.pointName ?? "暂存区"}
                    </div>
                  </Popover>
                )}
                {readonly && <StorageCacheDetail searchValue={searchValue} data={antennaPointItem} />}
              </DraggableResizableBox>
            </div>
          );
        }
        return null;
      })}
      {/* 线段坐标&角度信息 */}
      {antennaPointInfo?.map((antennaPointItem, pointIndex) => {
        return antennaPointItem?.directionInfo?.map((lineItem: LineTransformInfoType, lineIndex) => {
          return (
            <DragRotateBox
              key={lineItem.lineId}
              containerInfo={containerInfo}
              onPositionChange={(positionInfo) => {
                const newData =
                  updateAntennaPointLineInfo?.(antennaPointItem.pointId, lineItem.lineId, {
                    positionX: positionInfo.x,
                    positionY: positionInfo.y,
                  }) ?? [];
                form?.setFieldsValue({ pointInfo: [...newData] });
              }}
              position={{
                x: lineItem.positionX,
                y: lineItem.positionY,
              }}
              rotation={lineItem.angle}
              readonly={readonly}
            >
              {!readonly && (
                <Popover
                  trigger="contextMenu"
                  overlayInnerStyle={{ opacity: 0.8 }}
                  title={`${antennaPointItem?.pointName}`}
                  content={
                    <>
                      <Form.Item name={getPathName(pointIndex, lineIndex, "angle")} label="旋转">
                        <Slider
                          max={360}
                          min={0}
                          step={0.1}
                          tooltip={{ open: false }}
                          onChange={(v) => {
                            updateAntennaPointLineInfo?.(antennaPointItem?.pointId, lineItem?.lineId, {
                              angle: v,
                            });
                          }}
                        />
                      </Form.Item>

                      <Form.Item label="上一个点位" name={getPathName(pointIndex, lineIndex, "prevPointId")}>
                        <Select
                          style={{ width: 120 }}
                          options={getPointOptions(antennaPointItem?.pointId)}
                          onChange={(v) => {
                            updateAntennaPointLineInfo?.(antennaPointItem?.pointId, lineItem?.lineId, {
                              prevPointId: v,
                            });
                          }}
                        />
                      </Form.Item>
                      <Space>
                        <Button
                          onClick={() => {
                            openPointDrawer?.(pointIndex);
                          }}
                          type="dashed"
                        >
                          打开配置菜单
                        </Button>
                        <Button
                          onClick={() => {
                            addOrUpdateOneDevicePoint(antennaPointItem);
                          }}
                          type="primary"
                        >
                          提交
                        </Button>
                      </Space>
                    </>
                  }
                >
                  <Icons.CarHead className={styles["carHead"]} />
                  <div className={styles["ballBox"]}>
                    {Array.from({
                      length: lineItem.ballNumber ?? 3,
                    }).map((_, index) => {
                      return (
                        <div key={index} className={styles["ball"]}>
                          {index}
                        </div>
                      );
                    })}
                    <div className={styles["lineName"]}>{antennaPointItem.pointName}</div>
                  </div>
                </Popover>
              )}
              {readonly &&
                antennaPointItem.pointType === POINT_TYPE.ANTENNA &&
                isNilEmpty(lineItem?.relativeStagingAreaId) && (
                  <div className={styles["ballBox"]}>
                    {lineItem?.assets?.map((assetItem) => {
                      const isMark = assetItem?.sn === searchValue;
                      // 车头
                      if (assetItem.assetType === BALL_TYPE.TRAIN) {
                        return (
                          <>
                            <Tooltip
                              open={isMark || undefined}
                              title={
                                isMark ? (
                                  <div className="mark">
                                    <span>{assetItem?.sn}</span>
                                  </div>
                                ) : (
                                  `${assetItem?.sn}`
                                )
                              }
                              placement="right"
                              overlayClassName={classNames({
                                markTooltip: isMark,
                              })}
                            >
                              <Icons.CarHead
                                className={classNames(styles["carHead"], {
                                  [styles.unknownDirection]: !assetItem?.hasDirection,
                                })}
                              />
                            </Tooltip>
                          </>
                        );
                      }
                      // xxx点位
                      if (assetItem.assetType === BALL_TYPE.IRON_LADLE) {
                        return (
                          <BallPopoverMenu
                            defaultStatus={assetItem?.torpedoCarWeightStatus}
                            id={assetItem?.sn}
                            key={assetItem?.sn}
                          >
                            <Tooltip
                              open={isMark || undefined}
                              title={
                                isMark ? (
                                  <div className="mark">
                                    <span>{assetItem?.sn}</span>
                                  </div>
                                ) : (
                                  `${assetItem?.sn}`
                                )
                              }
                              placement="right"
                              overlayClassName={classNames({
                                markTooltip: isMark,
                              })}
                            >
                              {/* {lineItem?.angle} */}
                              {renderBall(assetItem?.torpedoCarWeightStatus, assetItem?.hasDirection)}
                              {/* <div className={styles["ball"]}>
                                  {item?.id}
                                </div> */}
                            </Tooltip>
                          </BallPopoverMenu>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
            </DragRotateBox>
          );
        });
      })}
    </div>
  );
};
export default DispatchImgView;
