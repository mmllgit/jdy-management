import httpUtil from '@/utils/httpUtil';
import { Button, Form, Input, InputNumber, message, Select } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './NewAddOrder.module.less'

const NewAddOrder = () => {

  const { Option } = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    try {
      values.lock_num = String(values.lock_num)
      values.pkg_num = String(values.pkg_num)
      values.is_get_lock = values.is_get_lock === '是' ? '已到货' : '未到货'
      const res = await httpUtil.newAddOrder(values)
      message.success(res)
      form.resetFields();
    } catch (err) {
      
    }
  };

  const selectChange = (value:string) => {
    if(value === '否'){
      form.setFieldsValue({
        pkg_num:0
      })
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className={styles['new-add-container']}>
      <div className={styles['title-container']}>
        <div>
          <span onClick={()=>navigate(-1)}>未接单</span>
          <span> &gt; </span>
          <span>维修单录入</span>
        </div>
        <div>维修单信息填写</div>
      </div>
      <div className={styles['form-container']}>
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className={styles['form-item-container']}>
            <div className={styles['form-title']}>
              客户信息
            </div>
            <div>
              <Form.Item
                className={styles['form-item']}
                label="客户姓名"
                name="name"
                rules={[
                  { required: true, message: '请输入客户姓名' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className={styles['form-item']}
                label="客户手机号"
                name="phone_number"
                rules={[
                  { required: true, message: '请输入客户手机号' },
                  { pattern:/^1[3-9][0-9]{9}$/g, message:'请输入正确的手机号码'}
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="客户地址"
                name="address"
                rules={[{ required: true, message: '请输入客户地址' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className={styles['form-item-container']}>
            <div className={styles['form-title']}>
              商品信息
            </div>
            <div>
              <Form.Item
                className={styles['form-item']}
                label="商品型号"
                name="lock_kind"
                rules={[{ required: true, message: '请输入商品型号' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="商品数量"
                name="lock_num"
                initialValue={0}
                rules={[{ required: true, message: '请输入商品数量' }]}
              >
                <InputNumber min={0}/>
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="是否到货"
                name="is_get_lock"
                rules={[{ required: true, message: '请选择是否到货' }]}
              >
                <Select
                  placeholder="请选择"
                  onChange={(value)=>selectChange(value)}
                  allowClear>
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="包裹数量"
                name="pkg_num"
                initialValue={0}
                rules={[{ required: true, message: '请填写包裹数量' }]}
              >
                <InputNumber min={0}/>
              </Form.Item>
            </div>
          </div>
          <div className={styles['form-item-container']}>
            <div className={styles['form-title']}>
              订单联系人及备注
            </div>
            <div>
              <Form.Item
                className={styles['form-item']}
                label="订单联系人"
                name="order_name"
                rules={[{ required: true, message: '请填写订单联系人' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="订单联系人手机号"
                name="order_number"
                rules={[
                  { required: true, message: '请填写订单联系人手机号' },
                  { pattern:/^1[3-9][0-9]{9}$/g, message:'请输入正确的手机号码'}
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles['form-item']}
                label="订单备注"
                name="remark"
                // rules={[{ required: true, message: '请填写订单备注' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className={styles['form-item-container']}>
            <div className={styles['form-title']}>
              <span>* </span>
              设定此单金额
            </div>
            <div>
              <Form.Item
                className={styles['form-item']}
                name="cost"
                initialValue={0}
                rules={[{ required: true, message: '请设定此单金额' }]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            className={styles['form-item-button']}
          >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={()=>handleBack()}>
              返回
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NewAddOrder
