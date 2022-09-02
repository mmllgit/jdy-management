import React from 'react'
import { Button, Form, Input, message } from 'antd';
import httpUtil from '@/utils/httpUtil';
import styles from './Login.module.less'
import { useNavigate } from 'react-router-dom';

const Login:React.FC = () => {

  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    const { account, password } = values
    try {
      const res = await httpUtil.adminLogin({
        account,
        password
      })
      localStorage.setItem("token", res)
      message.success('登录成功')
      navigate("/home")
    } catch (err) {
      
    }
  };

  return (
    <div className={styles['login-container']}>
      <img className={styles['login-img']} src={require('../../assets/images/login.png')} alt="" />
      <div className={styles['form-container']}>
        <div className={styles['form-title']}>请登录</div>
        <Form
          className={styles['form-wrapper']}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          labelAlign='right'
        >
          <Form.Item
            className={styles['form-item']}
            label="账号"
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className={styles['form-item']}
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className={styles['form-button']}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
