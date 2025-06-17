import { useNavigate } from "react-router-dom";

export default function SubNav2() {
  const navgate = useNavigate();
  return (
    <div>
      Sub Nav 2 Page
      <div
        onClick={() => {
          // 跳转到三级页面
          navgate("/nest-menu/sub-menu-2/sub-menu-2-1");
        }}
        className="cursor-pointer text-blue-500 hover:underline mt-4"
      >
        跳转到三级页面
      </div>
    </div>
  );
}
