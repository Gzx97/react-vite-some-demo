import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, type FormProps, Input } from "antd";
import { ROUTE_PATHS } from "@/router/route.constants";
import { login } from "@/api/modules/account/user";
import { useRequest } from "ahooks";

type FieldType = {
  account?: string;
  password?: string;
};

export default function LoginForm() {
  const navigate = useNavigate();

  // const { isPending, mutate: onLogin } = useMutation({
  //   mutationFn: (params: FieldType) => login(params),
  //   onSuccess: () => {},
  //   onError: () => {},
  // });
  const { run: onLogin, loading } = useRequest(login, {
    manual: true,
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (loading) return;
    onLogin(values);
    navigate(ROUTE_PATHS.landing);
    setTimeout(() => {
      window.$notification?.success({
        message: "登录成功",
        description: "欢迎回来",
      });
    }, 300);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      initialValues={{ account: "admin", password: "123456" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item name="account" rules={[{ required: true, message: "请输入手机号" }]}>
        <Input addonBefore={<UserOutlined />} placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
        <Input.Password addonBefore={<LockOutlined />} placeholder="请输入密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}
