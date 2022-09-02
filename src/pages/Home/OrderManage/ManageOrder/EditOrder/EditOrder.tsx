import React from "react";
import httpUtil from "@/utils/httpUtil";
import { Button, Form, Input, message, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditOrder.module.less";

const EditOrder = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { record } = useParams();
  const orderInfo = JSON.parse(record!);
  const { Id } = orderInfo;

  const onFinish = async (values: any) => {
    try {
      values.id = Id;
      const res = await httpUtil.updateOrder(values);
      message.success(res);
    } catch (err) {}
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["new-add-container"]}>
      <div className={styles["title-container"]}>
        <div>
          <span onClick={() => navigate(-1)}>未接单</span>
          <span> &gt; </span>
          <span>订单详情</span>
        </div>
        <div>维修单信息填写</div>
      </div>
      <div className={styles["form-container"]}>
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={orderInfo}
        >
          <div className={styles["form-item-container"]}>
            <div className={styles["form-title"]}>客户信息</div>
            <div>
              <Form.Item
                className={styles["form-item"]}
                label="客户姓名"
                name="name"
                rules={[{ required: true, message: "请输入客户姓名" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className={styles["form-item"]}
                label="客户手机号"
                name="phone_number"
                rules={[{ required: true, message: "请输入客户手机号" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="客户地址"
                name="address"
                rules={[{ required: true, message: "请输入客户地址" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className={styles["form-item-container"]}>
            <div className={styles["form-title"]}>商品信息</div>
            <div>
              <Form.Item
                className={styles["form-item"]}
                label="商品型号"
                name="lock_kind"
                rules={[{ required: true, message: "请输入商品型号" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="商品数量"
                name="lock_num"
                rules={[{ required: true, message: "请输入商品数量" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="是否到货"
                name="is_get_lock"
                rules={[{ required: true, message: "请选择是否到货" }]}
              >
                <Select placeholder="请选择" allowClear>
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="包裹数量"
                name="pkg_num"
                rules={[{ required: true, message: "请填写包裹数量" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className={styles["form-item-container"]}>
            <div className={styles["form-title"]}>订单联系人及备注</div>
            <div>
              <Form.Item
                className={styles["form-item"]}
                label="订单联系人"
                name="order_name"
                rules={[{ required: true, message: "请填写订单联系人" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="订单联系人手机号"
                name="order_number"
                rules={[{ required: true, message: "请填写订单联系人手机号" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles["form-item"]}
                label="订单备注"
                name="remark"
                // rules={[{ required: true, message: '请填写订单备注' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <Form.Item className={styles["form-item-button"]}>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
            <Button onClick={() => handleBack()}>返回</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditOrder
