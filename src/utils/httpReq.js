/* 
  自定义封装的http请求方法——httpReq
  其中对错误进行了统一处理
*/
import axios from "axios";
import { message } from "antd";
import { baseURL } from "./baseUrl";
const instance = axios.create({
  baseURL,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || "";
    config.headers = {
      "Content-Type": "application/json",
      token,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 添加返回拦截器，直接获取返回内容的data
instance.interceptors.response.use((res) => {
  if (res.headers["content-disposition"]) {
    const fileName = decodeURIComponent(
      res.headers["content-disposition"]?.split(";")[1]?.split("filename=")[1]
    );
    return {
      blob: res.data,
      fileName,
    };
  } else {
    return res.data;
  }
});
// 封装axios方法，并导出httpReq为新的请求工具
export const httpReq = (method, url, data, resType) => {
  return new Promise((resolve, reject) => {
    instance({
      method: method,
      url: url,
      data: data,
      responseType: resType,
    }).then(
      (res) => {
        const { code, data, msg, blob, fileName } = res;
        if (blob) {
          return resolve({
            blob,
            fileName,
          });
        }
        if (code === 200) {
          if (data === null) {
            resolve(msg);
          } else {
            resolve(data);
          }
        } else {
          if (msg === "参数错误") {
            message.error("请输入正确的搜索信息");
          }
          message.error(msg);
        }
      },
      (err) => {
        // 错误在这统一处理
        const status = err.response?.status;
        const errInfo = err.response?.data?.msg || status;
        // 将错误信息传递下去，用于结束请求loading
        reject({ status, errInfo });
        // 根据状态码做提示处理
        switch (status) {
          case 400:
            if (errInfo === "TOKEN过期") {
              message.error(`认证失败: ${errInfo}`);
              window.location.href = "/login";
              return;
            }
            message.error(`${errInfo}`);
            break;
          case 403:
            message.error(`授权失败: ${errInfo}`);
            break;
          case 404:
            message.error(`未找到资源: ${errInfo}`);
            break;
          case 412:
            message.error(`请求错误: ${errInfo}`);
            break;
          case 500:
            message.warning(`服务器未能处理`);
            break;
          default:
            break;
        }
      }
    );
  });
};
