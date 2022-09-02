import React, { useEffect, useState } from "react";
import styles from "./ShopImage.module.less";
import zhCN from "antd/es/locale/zh_CN";
import {
  Form,
  Input,
  Button,
  Upload,
  Table,
  Space,
  UploadProps,
  message,
  Image,
  Modal,
  ConfigProvider,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import httpUtil from "@/utils/httpUtil";

const ShopImage = () => {
  interface DataType {
    key: number;
    url: string;
    name: string;
  }

  const handleDelete = (id: string) => {
    setDeleteId(id.split(".")[0]);
    setDeleteVisible(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "商品型号",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "30%",
      render: (text: string) => {
        return <div>{text.split(".")[0]}</div>;
      },
    },
    {
      title: "商品图片",
      dataIndex: "url",
      key: "url",
      align: "center",
      width: "30%",
      render: (text: string) => {
        return (
          <Image src={text} style={{ width: "30px", height: "30px" }}></Image>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: "30%",
      render: (_, record) => {
        const { name } = record;
        return (
          <Space size="middle">
            <a onClick={() => handleDelete(name)}>删除</a>
          </Space>
        );
      },
    },
  ];

  const [form] = Form.useForm();
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [list, setList] = useState<DataType[]>([]);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const props: UploadProps = {
    beforeUpload: () => {
      if (!isFirst) {
        setIsFirst(true);
      } else {
        message.warning("只可上传一张商品照片");
      }
      return false;
    },
  };

  const onFinish = async (values: any) => {
    const { id, image } = values;
    const formData = new FormData();
    formData.append("image", image[0].originFileObj);
    formData.append("name", id);
    try {
      const res = await httpUtil.uploadImage(formData);
      message.success("上传成功");
      getShopImage();
      setIsFirst(false);
      form.resetFields();
    } catch (err) {}
  };

  const getShopImage = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getShopList();
      if (res !== "操作成功") {
        const arr = res.map((item: DataType, index: number) => {
          item.key = index;
          return item;
        });
        setList(arr);
        setLoading(false);
        return;
      }
      setList([]);
      setLoading(false);
    } catch (err) {}
  };

  const handleDeleteOk = async () => {
    try {
      const res = await httpUtil.deleteShop({
        id: deleteId,
      });
      message.success("删除成功");
      getShopImage();
      setDeleteVisible(false);
    } catch (err) {}
  };

  useEffect(() => {
    getShopImage();
  }, []);

  return (
    <div className={styles["shop-image-container"]}>
      <Modal
        okText="确定"
        cancelText="取消"
        visible={deleteVisible}
        onOk={() => handleDeleteOk()}
        onCancel={() => setDeleteVisible(false)}
      >
        <h3 style={{ textAlign: "center" }}>确定删除该商品吗？</h3>
      </Modal>
      <div className={styles["shop-image"]}>
        <div className={styles["shop-image-title"]}>上传图片</div>
        <Form
          form={form}
          layout="vertical"
          className={styles["form"]}
          onFinish={onFinish}
        >
          <Form.Item
            className={styles["form-item"]}
            label="商品型号"
            name="id"
            rules={[{ required: true, message: "请输入商品型号" }]}
          >
            <Input placeholder="请输入商品型号" />
          </Form.Item>
          <Form.Item
            className={styles["form-item"]}
            label="上传商品图片"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e: { fileList: any }) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: "请输入商品型号" }]}
          >
            <Upload {...props} maxCount={1} listType="picture-card">
              <div>请选择上传图片</div>
            </Upload>
          </Form.Item>
          <Form.Item className={styles["form-item"]}>
            <Button type="primary" htmlType="submit">
              立即上传
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles["shop-list"]}>
        <div className={styles["shop-image"]}>商品图片列表</div>
        <ConfigProvider locale={zhCN}>
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={{
              defaultPageSize: 4,
              pageSizeOptions: [4, 8, 12, 16],
              total: list.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          ></Table>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ShopImage
