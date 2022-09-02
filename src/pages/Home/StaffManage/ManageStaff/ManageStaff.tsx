import httpUtil from "@/utils/httpUtil";
import { ConfigProvider, message, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import zhCN from "antd/es/locale/zh_CN";
import styles from "./ManageStaff.module.less";

interface item {
  key: string;
  address: string;
  cost: number;
  flag: number;
  identity_back_image: string;
  identity_front_image: string;
  name: string;
  open_id: string;
  phone_number: string;
}

const ManageStaff: React.FC = () => {
  const [userList, setUserList] = useState<item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [removeVisible, setRemoveVisible] = useState<boolean>(false);
  const [removeId, setRemoveId] = useState<string>("");
  const [removeName, setRemoveName] = useState<string>("");

  const removeUser = (id: string, name: string) => {
    setRemoveId(id);
    setRemoveName(name);
    setRemoveVisible(true);
  };

  const columns: ColumnsType<item> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "手机号码",
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
    },
    {
      title: "工作省份",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "注册时间",
      key: "register_time",
      dataIndex: "register_time",
      align: "center",
    },
    {
      title: "审核时间",
      key: "review_time",
      dataIndex: "review_time",
      align: "center",
    },
    {
      title: "设定金额",
      key: "cost",
      dataIndex: "cost",
      align: "center",
    },
    {
      title: "在职管理",
      key: "action",
      align: "center",
      render: (_: any, record: item) => {
        const { open_id, name } = record;
        return (
          <Space size="middle">
            <a onClick={() => removeUser(open_id, name)}>移除</a>
          </Space>
        );
      },
    },
  ];

  const getPassUser = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getPassUser();
      const userArray = res.map((item: item) => {
        item.key = item.open_id;
        return item;
      });
      setUserList(userArray);
      setLoading(false);
    } catch (err) {}
  };

  const handleRemoveModal = async () => {
    try {
      const res = await httpUtil.removeUser({
        id: removeId,
      });
      setRemoveVisible(false);
      message.success("移除成功");
      getPassUser();
    } catch (err) {}
  };

  useEffect(() => {
    getPassUser();
  }, []);

  return (
    <div className={styles["manage-staff-container"]}>
      <Modal
        visible={removeVisible}
        onOk={() => handleRemoveModal()}
        onCancel={() => setRemoveVisible(false)}
      >
        <h3 style={{ textAlign: "center" }}>确定移{removeName}吗？</h3>
        <div style={{ textAlign: "center", fontSize: "12px" }}>
          删除后该员工不在拥有使用小程序的权限
        </div>
      </Modal>
      <div className={styles["manage-staff-title"]}>
        全部员工<span>（{userList.length}）</span>
      </div>
      <ConfigProvider locale={zhCN}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={userList}
          pagination={{
            defaultPageSize: 4,
            pageSizeOptions: [4, 8, 12, 16],
            total: userList.length,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default ManageStaff
