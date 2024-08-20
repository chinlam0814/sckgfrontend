import React, { useState } from 'react';
import './LoginPage.css'
import Header from './Components/Header'
import Footer from './Components/Footer'
import api from './Components/Api'
import Cookies from 'js-cookie'
import {Link, useNavigate} from 'react-router-dom'
import { Card, Input, Button, Form, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()

    const loginAction = async(e) => {
        e.preventDefault()
        console.log(username + password)
        const data = await api.login(username, password)
        console.log(data)
        //console.log(Cookies.get('user'))
        //console.log(Cookies.get('id'))

        if(username.length === 0){
            message.error('请输入用户名！')
        }
        else if(password.length === 0){
            message.error('请输入密码！')
        }
        else{
            if (data.errorCode === 404) {
                console.log(data)
                message.error('输入的用户不存在/密码错误！')
            }
            else {
                if (Cookies.get('user') === 'Account') {
                    message.success('登陆成功！')
                    console.log(data)
                    console.log(data.cookies.id)
                    setUserId(data.cookies.id)
                    navigate('/')
                } else if (Cookies.get('user') === 'Admin') {
                    message.success('登陆成功！')
                    navigate('/')
                } 
            }
        }
    }

    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 20 },
    };

    return (
        <div className='login-design'>
            <Header />
            <div className='login-box-design'>
                    <Card
                    title="登录"
                    style={{
                        width:500,
                    }}
                    >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input 
                                prefix={<UserOutlined />}
                                onChange={event => setUsername(event.target.value)}
                                placeholder="请输入用户名"/>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                onChange={event => setPassword(event.target.value)}
                                placeholder="请输入密码"/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 10 }}>
                            <Button type="primary" onClick={loginAction}>
                            登陆
                            </Button>
                        </Form.Item>
                    </Form>  
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage