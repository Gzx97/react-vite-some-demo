import React from "react";
import useWindowScale from "../hooks/useWindowScale";

export interface ScaleLayoutProps {
  className?: any;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number;
  height?: number;
}

const ScaleLayout = (props: ScaleLayoutProps) => {
  const { children, style, width, height } = props;
  const { scale } = useWindowScale({ width, height });
  return (
    <div
      style={{
        width: width ? `${width}px` : "100vw",
        height: height ? `${height}px` : "100vh",
        overflow: "hidden",
        background: "rgba(5,22,4,1)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "1920px",
          height: "1080px",
          transformOrigin: "left top",
          transform: `scale(${scale}) translate(-50%, -50%)`,
          transition: "transform .3s ease-in-out",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default ScaleLayout;
