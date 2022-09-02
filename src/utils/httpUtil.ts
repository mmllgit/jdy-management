/* 
  请求url配置
*/
// 引入请求方法
import { httpReq } from "./httpReq";
// 引入参数类型
import {
  adminLogin,
  getOrderList,
  backOrder,
  newAddOrder,
  updateOrder,
  getDetail,
  addExtraFare,
  auditUser,
  removeUser,
  searchInfo,
  teacherSearchInfo,
  uploadImage,
  deleteShop,
  updatePassword,
  exportOrder,
  backUnFinish,
} from "./params";

class HttpUtil {
  adminLogin = (params: adminLogin) => httpReq("post", "/admin/login", params);

  getOrderList = (params: getOrderList) =>
    httpReq("post", "/admin/retrieval/order", params);

  backOrder = (params: backOrder) =>
    httpReq("post", "/admin/delete/order", params);

  newAddOrder = (params: newAddOrder) =>
    httpReq("post", "/admin/upload/wxorder", params);

  updateOrder = (params: updateOrder) =>
    httpReq("post", "/admin/update/order/wait", params);

  getDetailOrder = (params: getDetail) =>
    httpReq("post", "/public/order/retrieval", params);

  addExtraFare = (params: addExtraFare) =>
    httpReq("post", "/admin/update/order/finish", params);

  getPassUser = () => httpReq("post", "/admin/review/getpass");

  getAuditInfo = () => httpReq("post", "/admin/review/get");

  auditUser = (params: auditUser) =>
    httpReq("post", "/admin/review/update", params);

  getAuditUser = () => httpReq("post", "/admin/review/getall");

  removeUser = (params: removeUser) =>
    httpReq("post", "/admin/review/delete", params);

  searchInfo = (params: searchInfo) =>
    httpReq("post", "/admin/retrieval/order/anyway", params);

  teacherSearchInfo = (params: teacherSearchInfo) =>
    httpReq("post", "/admin/retrieval/order/user", params);

  uploadImage = (params: uploadImage) =>
    httpReq("post", "/public/image/upload", params);

  getShopList = () => httpReq("post", "/admin/lockimage/get");

  deleteShop = (params: deleteShop) =>
    httpReq("post", "/admin/lockimage/delete", params);

  updatePassword = (params: updatePassword) =>
    httpReq("post", "/admin/password", params);

  exportOrder = (params: exportOrder) =>
    httpReq("post", "/admin/download/order", params, "blob");
  
  backUnFinish = (params: backUnFinish) =>
    httpReq("post", "/client/order/abnormal", params)
}

export default new HttpUtil();
