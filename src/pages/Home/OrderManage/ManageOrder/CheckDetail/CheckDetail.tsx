import httpUtil from "@/utils/httpUtil";
import { Button, Descriptions, Spin, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CheckDetail.module.less";

const CheckDetail = () => {

  enum orderStatus {
    "进行中" = 1,
    "已完成",
    "异常订单"
  }
  const navigate = useNavigate();
  const { id, option } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<any>();

  const handleBack = () => {
    navigate(-1);
  };

  const getOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getDetailOrder({
        id: id!,
      });
      const { OrderInfo } = res;
      setOrderInfo(OrderInfo);
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <div className={styles["new-add-container"]}>
      <div className={styles["title-container"]}>
        <div>
          <span onClick={() => navigate(-1)}>
            {orderInfo?.order_status && orderStatus[orderInfo?.order_status]}
          </span>
          <span> &gt; </span>
          <span>订单详情</span>
        </div>
      </div>
      {loading ? (
        <div className={styles["loading"]}>
          <Spin />
        </div>
      ) : (
        <div className={styles["order-info-container"]}>
          <div className={styles["order-info"]}>
            <Descriptions
              title="订单信息"
              layout="vertical"
              bordered
              column={{ xl: 4 }}
            >
              <Descriptions.Item label="订单编号">
                {orderInfo?.Id}
              </Descriptions.Item>
              <Descriptions.Item label="商品型号">
                {orderInfo?.lock_kind}
              </Descriptions.Item>
              <Descriptions.Item label="数量">
                {orderInfo?.lock_num}
              </Descriptions.Item>
              <Descriptions.Item label="客户">
                {orderInfo?.name}
              </Descriptions.Item>
              <Descriptions.Item label="客户手机号">
                {orderInfo?.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="详细地址">
                {orderInfo?.address}
              </Descriptions.Item>
              <Descriptions.Item label="是否到货">
                {orderInfo?.is_get_lock}
              </Descriptions.Item>
              <Descriptions.Item label="包裹数">
                {orderInfo?.pkg_num}
              </Descriptions.Item>
              <Descriptions.Item label="订单联系人姓名">
                {orderInfo?.order_name}
              </Descriptions.Item>
              <Descriptions.Item label="订单联系人电话">
                {orderInfo?.order_number}
              </Descriptions.Item>
              <Descriptions.Item label="订单备注">
                {orderInfo?.remark}
              </Descriptions.Item>
            </Descriptions>
          </div>
          {option === "2" ? (
            <div className={styles["extra-fare"]}>
              <Descriptions title="额外费用" bordered column={{ xl: 4 }}>
                <Descriptions.Item label="申请描述">
                  {orderInfo?.extra_cost}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : null}
          <div className={styles["teacher-info"]}>
            <Descriptions
              title="师傅信息"
              layout="vertical"
              bordered
              column={{ xl: 4 }}
            >
              <Descriptions.Item label="姓名">
                {orderInfo?.get_order_name}
              </Descriptions.Item>
              <Descriptions.Item label="电话号码">
                {orderInfo?.get_order_phone}
              </Descriptions.Item>
              <Descriptions.Item label="工作地点">
                {orderInfo?.get_order_address}
              </Descriptions.Item>
            </Descriptions>
          </div>
          {option === "2" ? (
            <div className={styles["finish-process"]}>
              <Descriptions
                title="完成过程"
                bordered
                column={{ xs: 11, sm: 16, md: 24 }}
              >
                <Descriptions.Item label="第一次打卡">
                  {orderInfo?.before_image?.map(
                    (item: string, index: number) => {
                      return (
                        <Image
                          className={styles["img"]}
                          src={item}
                          key={index}
                        />
                      );
                    }
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="第二次打卡">
                  {orderInfo?.after_image?.map(
                    (item: string, index: number) => {
                      return (
                        <Image
                          className={styles["img"]}
                          src={item}
                          key={index}
                        />
                      );
                    }
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="客户签名">
                  <Image
                    className={styles["img"]}
                    src={orderInfo?.sign_image}
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : null}
          {option === "3" ? (
            <div className={styles["abnormal-container"]}>
              <div className={styles["abnormal-title"]}>异常申报原因</div>
              <div className={styles["abnormal-content"]}>
                <div>{orderInfo?.abnormal}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div className={styles["back-container"]}>
        <Button onClick={() => handleBack()}>返回</Button>
      </div>
    </div>
  );
};

export default CheckDetail
