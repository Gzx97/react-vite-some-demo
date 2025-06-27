import { FC, useRef } from "react";
import { useSize } from "ahooks";
import { DispatchConfigProvider } from "../components/DispatchConfigProvider";
import useWindowScale from "../hooks/useWindowScale";
import styles from "./index.module.less";

const PointConfigViewPage: FC = () => {
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
        展示
        {/* <DispatchView wrapperSize={wrapperSize} /> */}
      </div>
    </DispatchConfigProvider>
  );
};
export default PointConfigViewPage;
