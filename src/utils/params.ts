export interface adminLogin {
  account: string;
  password: string;
}

export interface getOrderList {
  status: string;
  start_date: string;
  end_date: string;
}

export interface backOrder {
  id: string[];
}

export interface newAddOrder {
  lock_kind: string;
  lock_num: string;
  name: string;
  phone_number: string;
  address: string;
  is_get_lock: string;
  pkg_num: string;
  order_name: string;
  order_number: string;
  cost: number;
  remark: string;
}

export interface updateOrder {
  lock_kind: string;
  lock_num: string;
  name: string;
  phone_number: string;
  address: string;
  is_get_lock: string;
  pkg_num: string;
  order_name: string;
  order_number: string;
  remark: string;
}

export interface getDetail {
  id: string;
}

export interface addExtraFare {
  id: string;
  extra_cost: string;
}

export interface auditUser {
  cost: string;
  flag: string;
  openid: string;
  msg: string;
}

export interface removeUser {
  id: string;
}

export interface searchInfo {
  info: string;
}

export interface teacherSearchInfo {
  name: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface uploadImage {}

export interface deleteShop {
  id: string;
}

export interface updatePassword {
  account: string;
  old: string;
  new: string;
}

export interface exportOrder {
  kind: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface backUnFinish {
  id: string,
  abnormal: string
}
