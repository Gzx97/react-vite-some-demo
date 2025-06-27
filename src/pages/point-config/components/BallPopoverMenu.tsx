import React, { FC, useState } from "react";
import { useBoolean, useRequest } from "ahooks";
import { Button, Popover, PopoverProps } from "antd";
import classNames from "classnames";
import { largeScreenAssetApi } from "../apis/large-screen";
import { putAssetType } from "../apis/large-screen/asset.api";
import { BALL_STATUS, BallStatusConfig } from "./DispatchImgView";

import "./BallPopoverMenu.module.less";

export type BallPopoverMenuType = {
  id: string;
  defaultStatus?: BALL_STATUS;
  children: React.ReactNode;
} & PopoverProps;
export const BallPopoverMenu: FC<BallPopoverMenuType> = ({ defaultStatus, id, children }) => {
  const [, openController] = useBoolean(false);
  const [status, setStatus] = useState<BALL_STATUS | undefined>(defaultStatus);

  const { run: updateAssetsStatus } = useRequest(
    (params: putAssetType) => {
      return largeScreenAssetApi.updateAssetsStatus(params);
    },
    {
      manual: true,
    },
  );
  return (
    <Popover
      placement="top"
      // open={open}
      open={false}
      trigger="contextMenu"
      overlayClassName="contextMenuPopover"
      onOpenChange={() => {
        openController.toggle();
        setStatus(defaultStatus);
      }}
      content={
        <>
          <div className="contextMenu">
            {[BALL_STATUS.UNKNOWN, BALL_STATUS.FULL, BALL_STATUS.EMPTY].map((item) => {
              return (
                <p
                  key={item}
                  className={classNames("statusItem", {
                    active: item === status,
                  })}
                  onClick={() => {
                    setStatus(item);
                  }}
                >
                  {BallStatusConfig[item].text}
                </p>
              );
            })}
            <div className="btn">
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  updateAssetsStatus({
                    assetId: id,
                    torpedoCarWeightStatus: status ?? "",
                  });
                  openController.setFalse();
                }}
              >
                保存
              </Button>
            </div>
          </div>
        </>
      }
    >
      <div>{children}</div>
    </Popover>
  );
};
