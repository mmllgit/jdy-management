import httpUtil from "@/utils/httpUtil";
import { Button, Form, Input, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UpdatePassword.module.less";

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await httpUtil.updatePassword(values);
      message.success("修改成功");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {}
  };

  const layout = {
    labelCol: { span: 8 },
  };

  return (
    <div className={styles["update-password-container"]}>
      <div className={styles["update-password-title"]}>修改密码</div>
      <Form
        {...layout}
        labelAlign="right"
        className={styles["form-container"]}
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          className={styles["form-item"]}
          label="账号"
          name="account"
          rules={[{ required: true, message: "请输入账号" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles["form-item"]}
          label="原密码"
          name="old"
          rules={[{ required: true, message: "请输入原密码" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          className={styles["form-item"]}
          label="新密码"
          name="new"
          rules={[{ required: true, message: "请输入新密码" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className={styles["form-button"]}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePassword
