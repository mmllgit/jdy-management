import {
  UserOutlined,
  UnorderedListOutlined,
  PoweroffOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./Home.module.less";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("员工管理", "staffManage", <UserOutlined />, [
    getItem("审核信息", "/auditInfo"),
    getItem("管理员工", "/manageStaff"),
  ]),
  getItem("订单管理", "orderManage", <UnorderedListOutlined />, [
    getItem("管理订单", "/manageOrder"),
    getItem("师傅业绩", "/teacherPerform"),
    getItem("商品图片", "/shopImage"),
  ]),
  getItem("账号管理", "accountManage", <SettingOutlined />, [
    getItem("修改密码", "/updatePassword"),
  ]),
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    const { keyPath } = e;
    const path = keyPath.reduce((pre, cur) => {
      return cur + pre;
    });
    navigate(path);
  };

  const handelOff = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles["home-header"]}>
        <div>
          <UserOutlined />
          <span>商家管理员</span>
        </div>
        <div onClick={() => handelOff()}>
          <PoweroffOutlined />
          <span>退出登录</span>
        </div>
      </div>
      <div className={styles["item-container"]}>
        <div className={styles["menu-container"]}>
          <Menu
            className={styles["menu"]}
            onClick={onClick}
            defaultSelectedKeys={["/manageOrder"]}
            defaultOpenKeys={["orderManage"]}
            mode="inline"
            items={items}
          />
        </div>
        <div className={styles["item-content"]}>
          <div className={styles["outlet-container"]}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home
