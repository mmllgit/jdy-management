import httpUtil from "@/utils/httpUtil";
import zhCN from "antd/es/locale/zh_CN";
import {
  ConfigProvider,
  Button,
  DatePicker,
  DatePickerProps,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
  Tooltip,
  Modal,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import styles from "./TeacherPerform.module.less";
import { useNavigate } from "react-router-dom";
import moment, { Moment } from "moment";
import { useDispatch, useSelector } from "@/redux/hooks";
import { updateTeacherStateAC } from "@/redux/slice/teacherPerform";

const TeacherPerform = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const state = useSelector((state) => state.searchTeacherState);
  const dispatch = useDispatch();
  const [option, setOption] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeReset, setTimeReset] = useState<any>();
  const [startTimeMoment, setStartTimeMoment] = useState<any>();
  const [endTimeMoment, setEndTimeMoment] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [extraFareVisible, setExtraFareVisible] = useState<boolean>(false);
  const [getOrderName, setGetOrderName] = useState<string>("");
  const [extraOrderId, setExtraOrderId] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(0);
  const [teacherInfoValue, setTeacherInfoValue] = useState<string>("");
  const [backUnFinishVisible, setBackUnFinishVisible] = useState<boolean>(false)
  const [backReasonValue, setBackReasonValue] = useState<string>('')

  const publicColumn: any = [
    {
      title: "订单号",
      dataIndex: "Id",
      key: "Id",
      width: "6%",
      align: "center",
      render: (text: string) => (
        <Tooltip title={text} className={styles["text-flow"]}>
          <div
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "客户",
      dataIndex: "name",
      key: "name",
      width: "5%",
      align: "center",
    },
    {
      title: "详细地址",
      dataIndex: "address",
      key: "address",
      width: "7%",
      align: "center",
      render: (text: string) => {
        return (
          <Tooltip title={text} className={styles["text-flow"]}>
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: "客户手机号",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "8%",
      align: "center",
    },
    {
      title: "商品型号",
      dataIndex: "lock_kind",
      key: "lock_kind",
      width: "7%",
      align: "center",
    },
    {
      title: "数量",
      dataIndex: "lock_num",
      key: "lock_num",
      width: "5%",
      align: "center",
    },
    {
      title: "包裹数",
      dataIndex: "pkg_num",
      key: "pkg_num",
      width: "6%",
      align: "center",
    },
    {
      title: "订单联系人",
      dataIndex: "order_name",
      key: "order_name",
      width: "6%",
      align: "center",
      render: (text: string) => (
        <Tooltip title={text} className={styles["text-flow"]}>
          <div
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "联系人手机号",
      dataIndex: "order_number",
      key: "order_number",
      width: "6%",
      align: "center",
      render: (text: string) => (
        <Tooltip title={text} className={styles["text-flow"]}>
          <div
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "订单备注",
      dataIndex: "remark",
      key: "remark",
      width: "7%",
      align: "center",
      render: (text: string) => {
        return (
          <Tooltip title={text} className={styles["text-flow"]}>
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: "类型",
      dataIndex: "kind",
      key: "kind",
      width: "5%",
      align: "center",
      render: (text: string) => {
        return <span>{text === "AZ" ? "安装" : "维修"}</span>;
      },
    },
  ];

  const unFinishColumn = [
    {
      title: "订单收益",
      dataIndex: "cost",
      key: "cost",
      width: "5%",
      align: "center",
    },
    {
      title: "接单时间",
      dataIndex: "start_order_time",
      key: "start_order_time",
      width: "5%",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      width: "9%",
      align: "center",
      render: (_: any, record: any) => {
        const { Id } = record;
        return (
          <Space size="middle">
            <a onClick={() => handleCheckDetail(Id)}>查看详情</a>
            <a onClick={() => backUnFinish(Id)} style={{ color: "red" }}>
              撤销
            </a>
          </Space>
        );
      },
    }
  ];

  const finishColumn = [
    {
      title: "订单收益",
      dataIndex: "cost",
      key: "cost",
      width: "5%",
      align: "center",
    },
    {
      title: "额外费用",
      dataIndex: "extra_cost",
      key: "extra_cost",
      width: "5%",
      align: "center",
      render: (text: string) => {
        return <div>{text === "" ? "/" : text}</div>;
      },
    },
    {
      title: "完成时间",
      dataIndex: "finish_order_time",
      key: "finish_order_time",
      width: "5%",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      width: "9%",
      align: "center",
      render: (_: any, record: any) => {
        const { Id, extra_cost } = record;
        return (
          <Space size="middle">
            <a onClick={() => handleCheckDetail(Id)}>查看详情</a>
            <a onClick={() => addExtraFare(record)} style={{ color: "red" }}>
              {extra_cost === "" ? "增加" : "修改"}额外费用
            </a>
          </Space>
        );
      },
    },
  ];

  const abnormalColumn = [
    {
      title: "订单收益",
      dataIndex: "cost",
      key: "cost",
      width: "5%",
      align: "center",
    },
    {
      title: "额外费用",
      dataIndex: "extra_cost",
      key: "extra_cost",
      width: "5%",
      align: "center",
      render: (text: string) => {
        return <div>{text === "" ? "/" : text}</div>;
      },
    },
    {
      title: "申报时间",
      dataIndex: "finish_order_time",
      key: "finish_order_time",
      width: "5%",
      align: "center",
    },
    {
      title: "异常理由",
      dataIndex: "abnormal",
      key: "abnormal",
      width: "7%",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      width: "9%",
      align: "center",
      render: (_: any, record: any) => {
        const { Id } = record;
        return (
          <Space onClick={() => handleCheckDetail(Id)} size="middle">
            <a>查看详情</a>
          </Space>
        );
      },
    },
  ];

  const otherColumn = [[], unFinishColumn, finishColumn, abnormalColumn];

  const totalColumn = (index: number) => {
    let columnArray = publicColumn.concat(otherColumn[index]);
    if (index === 0 || index === 1) {
      columnArray.splice(6, 0, {
        title: "是否到货",
        dataIndex: "is_get_lock",
        key: "is_get_lock",
        width: "7%",
        align: "center",
      });
      if (index === 1) {
        columnArray.splice(1, 0, {
          title: "师傅",
          dataIndex: "get_order_name",
          key: "get_order_name",
          width: "5%",
          align: "center",
        },
        // {
        //   title: "师傅手机号",
        //   dataIndex: "get_order_phone",
        //   key: "get_order_phone",
        //   width: "6%",
        //   align: "center",
        //   render: (text: string) => (
        //     <Tooltip title={text} className={styles["text-flow"]}>
        //       <div
        //         style={{
        //           wordWrap: "break-word",
        //           wordBreak: "break-word",
        //         }}
        //       >
        //         {text}
        //       </div>
        //     </Tooltip>
        //   ),
          // }
        );
      }
    } else if (index === 2 || index === 3) {
      columnArray.splice(1, 0, {
        title: "师傅",
        dataIndex: "get_order_name",
        key: "get_order_name",
        width: "5%",
        align: "center",
      },
      // {
      //   title: "师傅手机号",
      //   dataIndex: "get_order_phone",
      //   key: "get_order_phone",
      //   width: "6%",
      //   align: "center",
      //   render: (text: string) => (
      //     <Tooltip title={text} className={styles["text-flow"]}>
      //       <div
      //         style={{
      //           wordWrap: "break-word",
      //           wordBreak: "break-word",
      //         }}
      //       >
      //         {text}
      //       </div>
      //     </Tooltip>
      //   ),
        // }
      );
    }
    return columnArray;
  };

  const backReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackReasonValue(e.currentTarget.value)
  }

  const backUnFinish = (id:string) => {
    setOrderId(id)
    setBackUnFinishVisible(true)
  }

  const handleBackOk = async () => {
    try {
      const res = await httpUtil.backUnFinish({
        id: orderId,
        abnormal: "商家撤销:" + backReasonValue
      })
      setBackReasonValue('')
      setBackUnFinishVisible(false)
      getOrderList(option)
      message.success("撤销成功")
    } catch (err) {
      
    }
  }

  const addExtraFare = (record: any) => {
    const { get_order_name, Id, extra_cost } = record;
    if (extra_cost === "") {
      setInputValue(0);
    } else {
      setInputValue(Number(extra_cost));
    }
    setGetOrderName(get_order_name);
    setExtraOrderId(Id);
    setExtraFareVisible(true);
  };

  const handleCheckDetail = (id: string) => {
    navigate(`/home/orderManage/checkDetail/${id}/${option}`);
  };

  const handleOk = async () => {
    try {
      const res = await httpUtil.backOrder({
        id: [orderId],
      });
      if (res === "操作成功") {
        message.success("撤销成功");
        getOrderList(option);
        setModalVisible(false);
      }
    } catch (err) {}
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setOption(value);
    getOrderList(value);
  };

  const onStartChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (!dateString) {
      setStartTimeMoment("");
      setEndTimeMoment("");
    } else {
      setStartTimeMoment(moment(new Date(dateString)));
    }
    setStartTime(dateString);
  };

  const onEndChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (!startTime) {
      message.warning("请先选择起始时间");
      setTimeReset(new Date());
      return;
    }
    if (!dateString) {
      setEndTimeMoment("");
    } else {
      setEndTimeMoment(moment(new Date(dateString)));
    }
    setEndTime(dateString);
  };

  const getOrderList = async (index: string) => {
    if (!startTime || !endTime || !teacherInfoValue) {
      return message.warning("请先完善筛选信息");
    }
    setLoading(true);
    try {
      const res = await httpUtil.teacherSearchInfo({
        status: index,
        start_date: startTime,
        end_date: endTime,
        name: teacherInfoValue,
      });
      if (res) {
        let dataList = []
        if (Array.isArray(res)) {
          dataList = res.map((item: any) => {
            item.key = item.Id;
            return item;
          });
        }
        setOrderList(dataList);
        setLoading(false);
        message.success("查询成功");
        dispatch(
          updateTeacherStateAC({
            option: index,
            startTime,
            endTime,
            name: teacherInfoValue,
          })
        );
      }
    } catch (err) {}
  };

  const handleReset = () => {
    setTimeReset(new Date());
    setTeacherInfoValue("");
    setEndTimeMoment('')
    setStartTimeMoment('')
    setOrderList([]);
    dispatch(
      updateTeacherStateAC({
        option: "",
        startTime: "",
        endTime: "",
        name: "",
      })
    );
  };

  const handleCancelExtra = () => {
    setExtraFareVisible(false);
  };

  const handleInputChange = (e: number) => {
    setInputValue(e);
  };

  const handleOkExtra = async () => {
    try {
      const res = await httpUtil.addExtraFare({
        id: extraOrderId,
        extra_cost: String(inputValue),
      });
      setInputValue(0);
      message.success(res);
      setExtraFareVisible(false);
      getOrderList(option);
    } catch (err) {}
  };

  const handleTeacherInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherInfoValue(e.currentTarget.value);
  };

  const disabledTime = (current: Moment) => {
    const start = moment(startTime);
    return current.valueOf() < start.valueOf();
  };

  const getReducerOrderList = async () => {
    const {
      option: optionState,
      startTime: startTimeState,
      endTime: endTimeState,
      name: nameState,
    } = state;
    if (optionState && startTimeState && endTimeState && nameState) {
      setOption(optionState);
      setStartTimeMoment(moment(new Date(startTimeState)));
      setEndTimeMoment(moment(new Date(endTimeState)));
      setStartTime(startTimeState);
      setEndTime(endTimeState);
      setTeacherInfoValue(nameState);
      setLoading(true);
      try {
        const res = await httpUtil.teacherSearchInfo({
          status: optionState,
          start_date: startTimeState,
          end_date: endTimeState,
          name: nameState,
        });
        if (res) {
          const dataList = res.map((item: any) => {
            item.key = item.Id;
            return item;
          });
          setOrderList(dataList);
          setLoading(false);
        }
      } catch (err) {}
    }
  };

  useEffect(() => {
    getReducerOrderList();
  }, []);

  return (
    <div className={styles["manage-order-container"]}>
      <Modal
        visible={backUnFinishVisible}
        onCancel={() => setBackUnFinishVisible(false)}
        onOk={() => handleBackOk()}
      >
        <h3 style={{ textAlign: "center" }}>
          您是否确定撤销该订单？
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection:'column'
          }}
        >
          <div style={{ margin: "10px 0" }}>如果是，请填写撤销原因：</div>
          <Input value={backReasonValue} onChange={(e)=>backReasonChange(e)} style={{width:'50%'}}></Input>
        </div>
      </Modal>
      <Modal
        visible={modalVisible}
        onCancel={() => handleCancel()}
        onOk={() => handleOk()}
      >
        <div style={{ textAlign: "center" }}>
          <h2>您是否确定撤销该订单？</h2>
        </div>
      </Modal>
      <Modal
        title={`给${getOrderName}添加额外费用`}
        visible={extraFareVisible}
        onCancel={() => handleCancelExtra()}
        onOk={() => handleOkExtra()}
      >
        <div
          style={{
            display: "flex",
            width: "50%",
            marginLeft: "35%",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginRight: "10px",
            }}
          >
            <InputNumber
              value={inputValue}
              onChange={handleInputChange}
            ></InputNumber>
          </div>
          <div>元</div>
        </div>
      </Modal>
      <div className={styles["date-picker-title"]}>
        <span>*</span>
        日期筛选
      </div>
      <div className={styles["date-picker-container"]}>
        <div className={styles["date-choose"]}>
          <div>
            <span>起始时间</span>
            <DatePicker
              key={timeReset}
              className={styles["date-picker"]}
              onChange={onStartChange}
              value={startTimeMoment}
              placeholder="选择起始时间"
            />
          </div>
          <div>
            <span>截至时间</span>
            <DatePicker
              key={timeReset}
              className={styles["date-picker"]}
              disabledDate={(e) => disabledTime(e)}
              onChange={onEndChange}
              value={endTimeMoment}
              placeholder="选择截至时间"
            />
          </div>
        </div>
        <div className={styles["teacher-input-button"]}>
          <div>
            <span>师傅信息</span>
            <Input
              value={teacherInfoValue}
              placeholder='输入师傅姓名或电话'
              onChange={(e) => handleTeacherInfoChange(e)}
            ></Input>
          </div>
          <div>
            <Button
              size="large"
              className={styles["button"]}
              onClick={() => getOrderList(option)}
            >
              查询结果
            </Button>
            <Button
              size="large"
              className={styles["button"]}
              onClick={() => handleReset()}
            >
              重置
            </Button>
          </div>
        </div>
      </div>
      <div className={styles["table-container"]}>
        <div className={styles["radio-number-container"]}>
          <Radio.Group
            size="large"
            className={styles["radio-container"]}
            defaultValue="1"
            buttonStyle="solid"
            onChange={onTypeChange}
            value={option}
          >
            <Radio.Button className={styles["radio-button"]} value="1">
              进行中
            </Radio.Button>
            <Radio.Button className={styles["radio-button"]} value="2">
              已完成
            </Radio.Button>
            <Radio.Button className={styles["radio-button"]} value="3">
              异常订单
            </Radio.Button>
          </Radio.Group>
          <div>订单数量：{orderList.length}</div>
        </div>
        <ConfigProvider locale={zhCN}>
          <Table
            columns={totalColumn(Number(option))}
            dataSource={orderList}
            loading={loading}
            pagination={{
              defaultPageSize: 16,
              pageSizeOptions: [16,32,64],
              total: orderList.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default TeacherPerform
