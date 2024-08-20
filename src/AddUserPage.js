import {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import api from './Components/Api'
import Footer from './Components/Footer'
import Header from './Components/Header'
import Cookies from 'js-cookie'
import { Radio, Select, Card, Form, Input, Button, message, Typography, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, UserSwitchOutlined } from '@ant-design/icons';
import './AddUserPage.css'

const AddUserPage = () => {
    const navigate = useNavigate()
    let loginType = Cookies.get('user')
    const [username, setUsername] = useState([])
    const [password1, setPassword1] = useState([])
    const [password2, setPassword2] = useState([])
    const [gender, setGender] = useState('man')

    const validUsername = /^[A-Za-z0-9]+$/;

    const createAction = async(e) => {
        e.preventDefault()
        console.log(password1 + ' ' + password2 + ' ' + username)

        if(username.length < 8){
            message.error('用户名至少8位！')
        }
        else if(password1.length === 0){
            message.error('请输入密码！')
        }
        else if(password1.length < 8){
            message.error('密码位数至少为8！')
        }
        else if(password2.length === 0){
            message.error('请输入确认密码！')
        }
        else if(password1.indexOf(' ')!== -1){
            message.error('密码不能包含空格！')
        }
        else if(password1 !== password2){
            message.error('密码和确认密码不一致！')
        }
        else if(username.indexOf(' ')!== -1){
            message.error('用户名不能包含空格！')
        }
        else if(!validUsername.test(username)){
            message.error('用户名只能包含字母和数字！')
        }
        else{
            var data

            data = await api.createAdmin(username, password1, gender)
            console.log(data)

            if(data.errorCode === 400){
                message.error('用户名已存在，请使用别的用户名！')
            }
            else{
                message.success('账号注册成功！')
                setTimeout(function(){
                    window.location.reload();
                }, 1800);
            }
        }
    }

    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 20 },
    };

    const buttonItemLayout = {
        wrapperCol: {offset: 10},
    };

    const handleChange = (e) => {
        console.log('radio checked', e.target.value);
        setGender(e.target.value);
    };

    return (
        <div className='add-user-design'>
            <Header />
            <div className='add-user-box-design'>
                    <Card
                    title="注册"
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
                            <Tooltip  placement="right" title='用户名至少8位，只能包含字母和数字！'>
                                <Input 
                                    prefix={<UserOutlined />}
                                    onChange={event => setUsername(event.target.value)}
                                    placeholder="请输入用户名"/>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Tooltip  placement="right" title='密码位数至少为8，不能含有空格！'>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    onChange={event => setPassword1(event.target.value)}
                                    placeholder="请输入密码"/>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="password"
                            rules={[{ required: true, message: '请输入确认密码' }]}
                        >
                            <Tooltip  placement="right" title='新密码与确认密码需一致！'>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    onChange={event => setPassword2(event.target.value)}
                                    placeholder="请输入确认密码"/>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item
                            label="性别"
                            name="gender"
                            rules={[{ required: true, message: '请选择您的性别' }]}
                        >
                            <Tooltip  placement="right" title='请选择您的性别！'>
                                <Radio.Group onChange={handleChange} value={gender}>
                                <Radio value={'man'}>男</Radio>
                                <Radio value={'woman'}>女</Radio>
                                </Radio.Group>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item {...buttonItemLayout}>
                            <Button className='add-user-button' type="primary" onClick={createAction}>
                            注册
                            </Button>
                        </Form.Item>
                    </Form>  
                </Card>
            </div>
            <Footer />
        </div>
    )
}

export default AddUserPage