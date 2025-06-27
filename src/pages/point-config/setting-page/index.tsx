import { FC, useRef } from "react";
import { useSize } from "ahooks";
import { DispatchConfigProvider } from "../components/DispatchConfigProvider";
import DispatchView from "../components/DispatchView";
import useWindowScale from "../hooks/useWindowScale";
import styles from "./index.module.less";

const PointConfigSettingPage: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperSize = useSize(wrapperRef);
  const { scale } = useWindowScale({
    width: wrapperSize?.width,
    height: wrapperSize?.height,
  });
  return (
    <DispatchConfigProvider
      value={{
        wrapperSize,
        scale,
      }}
    >
      <div ref={wrapperRef} className={styles["wrapper"]}>
        <DispatchView wrapperSize={wrapperSize} />
        配置
      </div>
    </DispatchConfigProvider>
  );
};
export default PointConfigSettingPage;
