import httpUtil from "@/utils/httpUtil";
import {
  ConfigProvider,
  Space,
  Table,
  Image,
  Radio,
  RadioChangeEvent,
  Modal,
  InputNumber,
  message,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import zhCN from "antd/es/locale/zh_CN";
import styles from "./AuditInfo.module.less";

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
  register_time: string;
  review_time: string;
}

const AuditInfo: React.FC = () => {
  const [unPassList, setUnPassList] = useState<item[]>([]);
  const [passList, setPassList] = useState<item[]>([]);
  const [option, setOption] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [passModal, setPassModal] = useState<boolean>(false);
  const [refuseModal, setRefuseModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [openId, setOpenId] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(0);
  const [reasonValue, setReasonValue] = useState<string>("");

  const columnList = [unPassList, passList];

  const handlePass = (name: string, open_id: string) => {
    setName(name);
    setOpenId(open_id);
    setPassModal(true);
  };

  const handleRefuse = (name: string, open_id: string) => {
    setName(name);
    setOpenId(open_id);
    setRefuseModal(true);
  };

  const publicColumns: ColumnsType<item> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "10%",
    },
    {
      title: "手机号码",
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
      width: "10%",
    },
    {
      title: "工作省份",
      dataIndex: "address",
      key: "address",
      align: "center",
      width: "10%",
    },
    {
      title: "身份证正面照",
      key: "identity_front_image",
      dataIndex: "identity_front_image",
      align: "center",
      width: "10%",
      render: (text: string) => {
        return (
          <Image src={text} style={{ width: "30px", height: "30px" }}></Image>
        );
      },
    },
    {
      title: "身份证反面照",
      key: "identity_back_image",
      dataIndex: "identity_back_image",
      align: "center",
      width: "10%",
      render: (text: string) => {
        return (
          <Image src={text} style={{ width: "30px", height: "30px" }}></Image>
        );
      },
    },
    {
      title: "注册时间",
      key: "register_time",
      dataIndex: "register_time",
      align: "center",
      width: "10%",
    },
  ];

  const unPassAction: ColumnsType<item> = [
    {
      title: "操作",
      key: "action",
      align: "center",
      width: "10%",
      render: (_: any, record: item) => {
        const { name, open_id } = record;
        return (
          <Space size="middle">
            <a onClick={() => handlePass(name, open_id)}>通过</a>
            <a
              style={{ color: "red" }}
              onClick={() => handleRefuse(name, open_id)}
            >
              拒绝
            </a>
          </Space>
        );
      },
    },
  ];

  const passAction: ColumnsType<item> = [
    {
      title: "审核时间",
      key: "review_time",
      dataIndex: "review_time",
      align: "center",
      width: "10%",
    },
    {
      title: "设定金额",
      key: "cost",
      dataIndex: "cost",
      align: "center",
      width: "10%",
      render: (text: string, record: item) => {
        const { flag } = record;
        return <div>{flag === 3 ? "无" : text}</div>;
      },
    },
    {
      title: "审核结果",
      key: "action",
      align: "center",
      dataIndex: "flag",
      width: "10%",
      render: (text: number) => {
        return (
          <div
            style={{
              margin: "0 auto",
              backgroundColor: text === 2 ? "#02A7F0" : "#D9001B",
              color: "white",
              width: "80%",
              padding: "6px",
              borderRadius: "14px",
            }}
          >
            {text === 2 ? "已通过" : "已拒绝"}
          </div>
        );
      },
    },
  ];

  const totalColumn = (index: number) => {
    if (index === 0) {
      return publicColumns.concat(unPassAction);
    }
    return publicColumns.concat(passAction);
  };

  const optionChange = ({ target: { value } }: RadioChangeEvent) => {
    setOption(value);
  };

  const getAuditUser = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getAuditInfo();
      const userArray = res.map((item: item) => {
        item.key = item.open_id;
        return item;
      });
      setUnPassList(userArray);
      setLoading(false);
    } catch (err) {}
  };

  const getCheckedUser = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getAuditUser();
      const userArray = res.map((item: item) => {
        item.key = item.open_id;
        return item;
      });
      setPassList(userArray);
      setLoading(false);
    } catch (err) {}
  };

  const handleInputChange = (number: number) => {
    setInputValue(number);
  };

  const handlePassModal = () => {
    checkUser("2");
  };

  const handleRefuseModal = () => {
    checkUser("3");
  };

  const checkUser = async (index: string) => {
    try {
      const res = await httpUtil.auditUser({
        cost: index === "3" ? "0" : String(inputValue),
        flag: index,
        openid: openId,
        msg:
          index === "3"
            ? reasonValue.trim() === ""
              ? "无"
              : reasonValue
            : "无",
      });
      setPassModal(false);
      setRefuseModal(false);
      message.success("操作成功");
      setReasonValue("");
      getAuditUser();
      getCheckedUser();
    } catch (err) {}
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReasonValue(e.currentTarget.value);
  };

  useEffect(() => {
    getAuditUser();
    getCheckedUser();
  }, []);

  return (
    <div className={styles["audit-info-container"]}>
      <Modal
        visible={passModal}
        onCancel={() => setPassModal(false)}
        onOk={() => handlePassModal()}
      >
        <div style={{ fontSize: "16px" }}>
          您决定同意{name}的申请，请为他的每笔安装订单设定一个费用：
        </div>
        <div style={{ marginLeft: "55%", marginTop: "10px" }}>
          <InputNumber
            value={inputValue}
            onChange={(value) => handleInputChange(value)}
          ></InputNumber>
          <span style={{ marginLeft: "10px" }}>元</span>
        </div>
      </Modal>
      <Modal
        visible={refuseModal}
        onCancel={() => setRefuseModal(false)}
        onOk={() => handleRefuseModal()}
      >
        <h3
          style={{ textAlign: "center" }}
        >{`您是否拒绝${name}的注册申请？`}</h3>
        <span style={{ marginLeft: "26%" }}>拒绝原因：</span>
        <Input
          style={{ width: "40%" }}
          onChange={(value) => handleReasonChange(value)}
          value={reasonValue}
        ></Input>
        <div
          style={{ textAlign: "center", fontSize: "12px", marginTop: "10px" }}
        >
          拒绝后，对方可重新提交注册申请
        </div>
      </Modal>
      <Radio.Group
        onChange={optionChange}
        size="large"
        className={styles["radio-container"]}
        defaultValue={0}
        buttonStyle="solid"
      >
        <Radio.Button className={styles["radio"]} value={0}>
          待审核（{unPassList.length}）
        </Radio.Button>
        <Radio.Button className={styles["radio"]} value={1}>
          已审核（{passList.length}）
        </Radio.Button>
      </Radio.Group>
      <ConfigProvider locale={zhCN}>
        <Table
          className={styles["table"]}
          loading={loading}
          columns={totalColumn(option)}
          dataSource={columnList[option]}
          pagination={{
            defaultPageSize: 4,
            pageSizeOptions: [4, 8, 12, 16],
            total: columnList[option].length,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default AuditInfo;
