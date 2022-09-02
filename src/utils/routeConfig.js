import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { Spin } from "antd";

const Login = lazy(() => import("@/pages/Login/Login"));
const Home = lazy(() => import("@/pages/Home/Home"));
const NotFound = lazy(() => import("@/pages/notFound/notFound"));
const StaffManage = lazy(() => import("@/pages/Home/StaffManage/StaffManage"));
const OrderManage = lazy(() => import("@/pages/Home/OrderManage/OrderManage"));
const AuditInfo = lazy(() =>
  import("@/pages/Home/StaffManage/AuditInfo/AuditInfo")
);
const ShopImage = lazy(() =>
  import("@/pages/Home/OrderManage/ShopImage/ShopImage")
);
const TeacherPerform = lazy(() =>
  import("@/pages/Home/OrderManage/TeacherPerform/TeacherPerform")
);
const ManageOrder = lazy(() =>
  import("@/pages/Home/OrderManage/ManageOrder/ManageOrder")
);
const ManageStaff = lazy(() =>
  import("@/pages/Home/StaffManage/ManageStaff/ManageStaff")
);
const EditOrder = lazy(() =>
  import("@/pages/Home/OrderManage/ManageOrder/EditOrder/EditOrder")
);
const NewAddOrder = lazy(() =>
  import("@/pages/Home/OrderManage/ManageOrder/NewAddOrder/NewAddOrder")
);
const CheckDetail = lazy(() =>
  import("@/pages/Home/OrderManage/ManageOrder/CheckDetail/CheckDetail")
);
const AccountManage = lazy(() =>
  import("@/pages/Home/AccountManage/AccountManage")
);
const UpdatePassword = lazy(() =>
  import("@/pages/Home/AccountManage/UpdatePassword/UpdatePassword")
);

const routeConfig = [
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Navigate to="orderManage" />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "orderManage",
        element: <Navigate to="manageOrder" />,
      },
      {
        path: "staffManage",
        element: <StaffManage />,
        children: [
          {
            path: "auditInfo",
            element: <AuditInfo />,
          },
          {
            path: "manageStaff",
            element: <ManageStaff />,
          },
        ],
      },
      {
        path: "orderManage",
        element: <OrderManage />,
        children: [
          {
            path: "manageOrder",
            element: <ManageOrder />,
          },
          {
            path: "editOrder/:record",
            element: <EditOrder />,
          },
          {
            path: "newAddOrder",
            element: <NewAddOrder />,
          },
          {
            path: "checkDetail/:id/:option",
            element: <CheckDetail />,
          },
          {
            path: "teacherPerform",
            element: <TeacherPerform />,
          },
          {
            path: "shopImage",
            element: <ShopImage />,
          },
        ],
      },
      {
        path: "accountManage",
        element: <AccountManage />,
        children: [
          {
            path: "updatePassword",
            element: <UpdatePassword />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const syncRouter = (table) => {
  let mRouteTable = [];
  table.forEach((route) => {
    mRouteTable.push({
      path: route.path,
      element: (
        <Suspense
          fallback={
            <div
              style={{
                margin: "20px 0",
                marginBottom: "20px",
                padding: "30px 50px",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              <Spin size="large"/>
            </div>
          }
        >
          {route.element}
        </Suspense>
      ),
      children: route.children && syncRouter(route.children),
    });
  });
  return mRouteTable;
};

export default () => useRoutes(syncRouter(routeConfig));
