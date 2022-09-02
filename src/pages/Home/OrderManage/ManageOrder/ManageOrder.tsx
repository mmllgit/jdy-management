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
  Select,
  Upload,
  UploadProps,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./ManageOrder.module.less";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "@/redux/hooks";
import { baseURL } from "@/utils/baseUrl";
import moment, { Moment } from "moment";
import { updateStateAC } from "@/redux/slice/searchState";

const ManageOrder = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.searchState);
  const [option, setOption] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeReset, setTimeReset] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [extraFareVisible, setExtraFareVisible] = useState<boolean>(false);
  const [getOrderName, setGetOrderName] = useState<string>("");
  const [extraOrderId, setExtraOrderId] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [exportVisible, setExportVisible] = useState<boolean>(false);
  const [kind, setKind] = useState<string>("AZ");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [startTimeMoment, setStartTimeMoment] = useState<any>();
  const [endTimeMoment, setEndTimeMoment] = useState<any>();
  const [checkDelete, setCheckDelete] = useState<any[]>([]);
  const [checkVisible, setCheckVisible] = useState<boolean>(false);
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

  const unStartColumn = [
    {
      title: "录入时间",
      dataIndex: "created_time",
      key: "created_time",
      width: "8%",
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
            <a onClick={() => handleEdit(JSON.stringify(record))}>编辑</a>
            <a style={{ color: "red" }} onClick={() => showBackModal(Id)}>
              撤销
            </a>
          </Space>
        );
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

  const otherColumn = [
    unStartColumn,
    unFinishColumn,
    finishColumn,
    abnormalColumn,
  ];

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
        //   }
        );
      }
    } else if (index === 2 || index === 3) {
      columnArray.splice(1, 0, {
        title: "师傅",
        dataIndex: "get_order_name",
        key: "get_order_name",
        width: "6%",
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
      //   }
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
      message.success("撤销成功")
      if (isSearch) {
        onSearch(searchValue);
      } else {
        getOrderList();
      }
    } catch (err) {
      
    }
  }

  const addExtraFare = (record: any) => {
    const { get_order_name, Id, extra_cost } = record;
    setInputValue(extra_cost);
    setGetOrderName(get_order_name);
    setExtraOrderId(Id);
    setExtraFareVisible(true);
  };

  const showBackModal = (id: string) => {
    setOrderId(id);
    setModalVisible(true);
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
        if (isSearch) {
          onSearch(searchValue);
        } else {
          getOrderList();
        }
        setModalVisible(false);
      }
    } catch (err) {}
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleEdit = (record: string) => {
    navigate(`/home/orderManage/editOrder/${record}`);
  };

  const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setOption(value);
    setOrderList([]);
    setStartTimeMoment("");
    setEndTimeMoment("");
    setTimeReset(new Date());
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

  const onSearch = async (value: string) => {
    if (!value) {
      return message.warning("输入内容后再搜索");
    }
    setSearchValue(value);
    try {
      const res = await httpUtil.searchInfo({
        info: value,
      });
      const showList = [];
      for (const item of res) {
        const { order_status } = item;
        item.key = item.Id;
        if (order_status === Number(option)) {
          showList.push(item);
        }
        setOrderList(showList);
      }
      if (showList.length === 0) {
        return message.warning("未查找到该状态下该人员或订单相关信息");
      }
      setIsSearch(true)
      message.success("搜索成功");
    } catch (err) {}
  };

  const getOrderList = async () => {
    if (!startTime || !endTime) {
      return message.warning("请先选择时间");
    }
    setLoading(true);
    try {
      const res = await httpUtil.getOrderList({
        status: option,
        start_date: startTime,
        end_date: endTime,
      });
      if (res) {
        const dataList = res.map((item: any) => {
          item.key = item.Id;
          return item;
        });
        setOrderList(dataList);
        setLoading(false);
        setIsSearch(false)
        dispatch(
          updateStateAC({
            option,
            startTime,
            endTime,
          })
        );
        message.success("查询成功");
      }
    } catch (err) {}
  };

  const handleReset = () => {
    setTimeReset(new Date());
    setStartTimeMoment("");
    setEndTimeMoment("");
    setOrderList([]);
    dispatch(
      updateStateAC({
        option: "",
        startTime: "",
        endTime: "",
      })
    );
  };

  const handleNewAdd = () => {
    navigate(`/home/orderManage/newAddOrder`);
  };

  const handleCancelExtra = () => {
    setExtraFareVisible(false);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.currentTarget.value);
  };

  const handleOkExtra = async () => {
    try {
      const res = await httpUtil.addExtraFare({
        id: extraOrderId,
        extra_cost: String(inputValue),
      });
      setInputValue("");
      message.success(res);
      setExtraFareVisible(false);
      getOrderList();
    } catch (err) {}
  };

  const exportOk = async () => {
    try {
      const res = await httpUtil.exportOrder({
        kind: kind,
        status: option,
        start_date: startTime,
        end_date: endTime,
      });
      const { blob: blobRes, fileName } = res;
      const blob = new Blob([blobRes], {
        type: "application/vnd.ms-excel",
      });
      const aLink = document.createElement("a");
      aLink.download = fileName + ".xlsx";
      aLink.style.display = "none";
      aLink.href = URL.createObjectURL(blob);
      document.body.appendChild(aLink);
      aLink.click();
      URL.revokeObjectURL(aLink.href);
      document.body.removeChild(aLink);
      setExportVisible(false);
      message.success("导出成功");
    } catch (err) {}
  };

  const { Option } = Select;

  const handleSelectChange = (value: string) => {
    setKind(value);
  };

  const handleExport = () => {
    if (!startTime || !endTime) {
      return message.warning("请先选择导出时间范围");
    }
    setExportVisible(true);
  };

  const token = localStorage.getItem("token")!;

  const props: UploadProps = {
    name: "excel",
    action: `${baseURL}/admin/upload/azorder`,
    headers: {
      token,
    },
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error(`${file.name}不是excel文件`);
      }
      return isExcel || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`数据导入成功`);
      } else if (info.file.status === "error") {
        message.error(`文件上传失败,请重试`);
      }
    },
  };

  const disableDate = (current: Moment) => {
    const start = moment(startTime);
    return current.valueOf() < start.valueOf();
  };

  const handleTipContent = (index: string) => {
    let content = "";
    switch (index) {
      case "0":
        content = "（订单录入时间）";
        break;
      case "1":
        content = "（接单时间）";
        break;
      case "2":
        content = "（订单完成时间）";
        break;
      case "3":
        content = "（异常订单申报时间）";
        break;
      default:
        break;
    }
    return content;
  };

  const getReducerOrderList = async () => {
    const {
      option: optionState,
      startTime: startTimeState,
      endTime: endTimeState,
    } = state;
    if (optionState && startTimeState && endTimeState) {
      setOption(optionState);
      setStartTimeMoment(moment(new Date(startTimeState)));
      setEndTimeMoment(moment(new Date(endTimeState)));
      setStartTime(startTimeState);
      setEndTime(endTimeState);
      setLoading(true);
      try {
        const res = await httpUtil.getOrderList({
          status: optionState,
          start_date: startTimeState,
          end_date: endTimeState,
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      const checkList = selectedRowKeys.map((item: any) => {
        return item;
      });
      setCheckDelete(checkList);
    },
  };

  const handleCheckDelete = () => {
    setCheckVisible(true);
  };

  const handleCheckOk = async () => {
    try {
      const res = await httpUtil.backOrder({
        id: checkDelete,
      });
      message.success("撤销成功");
      getOrderList();
      setCheckVisible(false);
      setCheckDelete([]);
    } catch (err) {}
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
        visible={checkVisible}
        onCancel={() => setCheckVisible(false)}
        onOk={() => handleCheckOk()}
      >
        <div style={{ textAlign: "center" }}>
          <h2>您是否确定撤销选中的订单？</h2>
        </div>
      </Modal>

      <Modal
        title={`给${getOrderName}更改额外费用`}
        visible={extraFareVisible}
        onCancel={() => handleCancelExtra()}
        onOk={() => handleOkExtra()}
      >
        <div
          style={{
            display: "flex",
            width: "70%",
            marginLeft: "15%",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Input value={inputValue} onChange={handleInputChange}></Input>
        </div>
      </Modal>
      <Modal
        visible={exportVisible}
        onOk={() => exportOk()}
        onCancel={() => setExportVisible(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          确定导出{startTime}到{endTime}的订单吗？
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginTop: "10px" }}>如果是，请选择订单类型：</div>
          <Select
            style={{ marginTop: "10px" }}
            defaultValue="AZ"
            onChange={handleSelectChange}
          >
            <Option value="AZ">安装单</Option>
            <Option value="WX">维修单</Option>
          </Select>
        </div>
      </Modal>
      <div className={styles["manage-order-header"]}>
        <Radio.Group
          size="large"
          className={styles["radio-container"]}
          defaultValue="a"
          buttonStyle="solid"
          onChange={onTypeChange}
          value={option}
        >
          <Radio.Button className={styles["radio-button"]} value="0">
            未接单
          </Radio.Button>
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
        <Search
          className={styles["search-container"]}
          placeholder="输入客户姓名/电话、师傅姓名/电话、订单号/商品型号"
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <div className={styles["date-picker-title"]}>
        <span>*</span>
        日期筛选{handleTipContent(option)}
      </div>
      <div className={styles["date-picker-container"]}>
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
            disabledDate={(e) => disableDate(e)}
            onChange={onEndChange}
            value={endTimeMoment}
            placeholder="选择截至时间"
          />
        </div>
        <div>
          <Button className={styles["button"]} onClick={() => getOrderList()}>
            查询结果
          </Button>
          <Button className={styles["button"]} onClick={() => handleReset()}>
            重置
          </Button>
        </div>
      </div>
      <div className={styles["table-container"]}>
        <div className={styles["table-header"]}>
          <div>
            共<span className={styles["span"]}>{orderList.length}</span>条记录
            {option === "0" && checkDelete.length !== 0 && (
              <Button
                size="large"
                type="primary"
                onClick={() => handleCheckDelete()}
                style={{ marginLeft: "30px" }}
              >
                批量撤销
              </Button>
            )}
          </div>
          <div>
            {option === "0" && (
              <Button
                className={styles["button"]}
                onClick={() => handleNewAdd()}
                icon={<PlusCircleOutlined />}
                type="primary"
                size="large"
              >
                新增维修单
              </Button>
            )}
            {option === "0" && (
              <div>
                <Upload {...props} showUploadList={false}>
                  <Button>导入</Button>
                </Upload>
              </div>
            )}
              <Button
                className={styles["button"]}
                onClick={() => handleExport()}
                size="large"
              >
                导出
              </Button>
          </div>
        </div>
        {option === "0" ? (
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
              rowSelection={{
                columnWidth: "1%",
                type: "checkbox",
                ...rowSelection,
              }}
            />
          </ConfigProvider>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ManageOrder
