import { forwardRef, useImperativeHandle } from "react";

export type ChildrenMethods = {
  onDataChange: (data: string) => void;
};

type ChildrenProps = {
  [key: string]: any;
};
const MyChildren = forwardRef<ChildrenMethods, ChildrenProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    onDataChange: (data: string) => {
      console.log("Children onDataChange:", data);
    },
  }));
  return <div>Children</div>;
});

export default MyChildren;
