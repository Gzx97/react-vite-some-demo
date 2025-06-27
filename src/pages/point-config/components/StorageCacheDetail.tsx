import React, { FC, useMemo, useRef } from "react";
import { useBoolean, useHover } from "ahooks";
import { Empty, Tooltip } from "antd";
import classNames from "classnames";
import * as Icons from "../images";
import { BallPopoverMenu } from "./BallPopoverMenu";
import { BALL_STATUS, BALL_TYPE } from "./DispatchImgView";
import { LineTransformInfoType, pointInfoType } from "./DispatchView";
import styles from "./StorageCacheDetail.module.less";
export type StorageCacheDetailType = {
  data: pointInfoType;
  searchValue?: string;
};
export const StorageCacheDetail: FC<StorageCacheDetailType> = ({ data, searchValue }) => {
  const [, openController] = useBoolean(false);
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const getCarDirection = (angle: number) => {
    if (angle > 260 && angle < 290) {
      return {
        style: { transform: "rotateY(0deg)" },
      };
    }
    if (angle > 80 && angle < 100) {
      return {
        style: { transform: "rotateY(180deg)" },
      };
    }
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
  const getBallNumber = (directionInfo: LineTransformInfoType[]) => {
    return directionInfo.reduce((totalLength, item) => {
      const newAssets = item?.assets?.filter((i) => {
        return i.assetType !== BALL_TYPE.TRAIN;
      });
      return totalLength + (newAssets?.length ?? 0);
    }, 0);
  };
  const getTrainNumber = (directionInfo: LineTransformInfoType[]) => {
    return directionInfo.reduce((totalLength, item) => {
      const newAssets = item?.assets?.filter((i) => {
        return i.assetType !== BALL_TYPE.IRON_LADLE;
      });
      return totalLength + (newAssets?.length ?? 0);
    }, 0);
  };
  const isIdInDirectionInfo = useMemo(() => {
    return data?.directionInfo
      ?.flatMap((info) => info?.assets)
      ?.filter(Boolean)
      ?.some((asset) => asset?.sn === searchValue);
  }, [data, searchValue]);

  return (
    <div
      onClick={() => {
        openController.toggle();
      }}
      className={styles["storageCacheNameBox"]}
      ref={ref}
    >
      {/* {data?.pointName ?? "暂存区"} */}
      {`xxx点位：${getBallNumber(data?.directionInfo)}`}
      <br />
      {`机车：${getTrainNumber(data?.directionInfo)}`}
      {/* {(isIdInDirectionInfo || isHovering) && */}
      {/* {((getBallNumber(data?.directionInfo) + getTrainNumber(data?.directionInfo)) !== 0 || isHovering) && ( */}
      {(isHovering || isIdInDirectionInfo) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={styles["detailModalWrapper"]}
        >
          {/* <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              openController.setFalse();
            }}
            className={styles["close"]}
          /> */}
          <div className={styles["innerWrapper"]}>
            {data?.directionInfo?.map((car) => {
              return (
                <div key={car?.lineId} className={classNames(styles["top"], styles["item"])}>
                  <div style={getCarDirection(car.angle)?.style} className={styles["ballBox"]}>
                    {car?.assets?.map((item) => {
                      const isMark = searchValue === item.sn;
                      // 车头
                      if (item.assetType === BALL_TYPE.TRAIN) {
                        return (
                          <>
                            <Tooltip
                              open={isMark || undefined}
                              title={
                                isMark ? (
                                  <div className="mark">
                                    <span>{item.sn}</span>
                                  </div>
                                ) : (
                                  `${item.sn}`
                                )
                              }
                              placement="right"
                              overlayClassName={classNames({
                                markTooltip: isMark,
                              })}
                            >
                              <Icons.CarHead
                                className={classNames(styles["carHead"], {
                                  [styles.unknownDirection]: !item?.hasDirection,
                                })}
                              />
                            </Tooltip>
                          </>
                        );
                      }
                      if (item.assetType === BALL_TYPE.IRON_LADLE) {
                        return (
                          <BallPopoverMenu defaultStatus={BALL_STATUS.EMPTY} id={item?.sn} key={item.sn}>
                            <Tooltip
                              open={isMark || undefined}
                              title={
                                isMark ? (
                                  <div className="mark">
                                    <span>{item.sn}</span>
                                  </div>
                                ) : (
                                  `${item.sn}`
                                )
                              }
                              placement="right"
                              overlayClassName={classNames({
                                markTooltip: isMark,
                              })}
                            >
                              {renderBall(item?.torpedoCarWeightStatus, item?.hasDirection)}
                              {/* <div key={index} className={styles["ball"]}>
                              {item.id}
                            </div> */}
                            </Tooltip>
                          </BallPopoverMenu>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
            {getBallNumber(data?.directionInfo) + getTrainNumber(data?.directionInfo) === 0 && (
              <Empty description={<span style={{ color: "rgba(4, 133, 226, 1)" }}>暂无数据</span>} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
