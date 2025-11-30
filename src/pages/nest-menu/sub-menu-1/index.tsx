import { useRef } from "react";
import MyChildren, { ChildrenMethods } from "./components/MyChildren";
import styles from "./index.module.less";
export default function SubNav1() {
  const childrenRef = useRef<ChildrenMethods | null>(null);

  return (
    <div
      onClick={() => {
        childrenRef.current?.onDataChange("hahahaha");
      }}
      className={styles.test}
    >
      Sub Nav 1 Page
      <MyChildren ref={childrenRef} />
    </div>
  );
}
