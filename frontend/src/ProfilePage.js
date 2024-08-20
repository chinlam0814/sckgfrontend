import './ProfilePage.css'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import api from "./Components/Api"
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { Radio, Popconfirm, Flex, Space, Modal, Button, Tooltip, Card, Input, Typography, Form, message } from 'antd';
import { ManOutlined, WomanOutlined, UserOutlined, CalendarOutlined, LockOutlined } from '@ant-design/icons';


const ProfilePage = () => {
    const navigate = useNavigate()
    const id = Cookies.get('id')
    let loginType = Cookies.get('user')

    const [username, setUsername] = useState([])
    const [newUsername, setNewUsername] = useState([])
    const [password, setPassword] = useState([])
    const [password1, setPassword1] = useState([])
    const [date, setDate] = useState([])
    const [gender, setGender] = useState([])
    const [account, setAccount] = useState([])
    const [admin, setAdmin] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const validUsername = /^[A-Za-z0-9]+$/;

    const showEditModal1 = () => {
        setIsModalOpen1(true);
    };

    const showEditModal2 = () => {
        setIsModalOpen2(true);
    };

    const handleOk1 = async(e) => {
        var data
        console.log(password + password1)

        if(password.length === 0){
            message.error('请输入密码！')
        }
        else if(password.length < 8){
            message.error('密码位数至少为8！')
        }
        else if(password1.length === 0){
            message.error('请输入确认密码！')
        }
        else if(password.indexOf(' ')!== -1){
            message.error('密码不能包含空格！')
        }
        else if(password !== password1){
            message.error('密码和确认密码不一致！')
        }
        else{
            if(loginType === 'Admin'){
                data = await api.adminChangePassword(id, password)

                if(data.errorCode === 0){
                    message.success('密码修改成功！')

                    setTimeout(function(){
                        window.location.reload();
                    }, 1800);
                }
                else{
                    message.error('密码修改失败！')
                }
            }
            else{
                data = await api.accountChangePassword(id, password)

                if(data.errorCode === 0){
                    message.success('密码修改成功！')

                    setTimeout(function(){
                        window.location.reload();
                    }, 1800);
                }
                else{
                    message.error('密码修改失败！')
                }
            }
        }
    };

    const handleCancel1 = () => {
        setPassword('')
        setPassword1('')
        setIsModalOpen1(false);
    };

    const handleOk2 = async() => {
        //setGender(value)
        //setIsModalOpen2(false);

        var data

        data = await api.editGender(id, gender)

        console.log(data)

        if(data.errorCode === 0){
            message.success('修改成功！')

            setTimeout(function(){
                window.location.reload();
            }, 1800);
        }
        else {
            message.error('修改失败！');
        }
    };

    const handleCancel2 = () => {
        // setPassword('')
        // setPassword1('')
        setIsModalOpen2(false);
    };

    const confirm = async(e) => {
        var data
        if(loginType === 'Admin'){
            data = await api.deleteAdmin(id)

            if(data.errorCode === 0){
                message.success('注销成功！');
                Cookies.remove("user")
			    Cookies.remove("username")
			    Cookies.remove("id")
                navigate('/')
            }
            else{
                message.success('注销失败！');
            }
        }
        else{
            data = await api.deleteAccount(id)

            if(data.errorCode === 0){
                message.success('注销成功！');
                Cookies.remove("user")
			    Cookies.remove("username")
			    Cookies.remove("id")
                navigate('/')
            }
            else{
                message.error('注销失败！');
            }
        }
    };

    const cancel = (e) => {
        console.log('cancel');
    };
    
    const showEditModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async(e) => {
        console.log(newUsername)

        if(newUsername.length < 8){
            message.error('用户名至少8位！')
        }
        else if(newUsername.indexOf(' ')!== -1){
            message.error('用户名不能包含空格！')
        }
        else if(!validUsername.test(newUsername)){
            message.error('用户名只能包含字母和数字！')
        }
        else if(newUsername === username){
            message.error('新用户名与旧用户名相同！')
        }
        else{
            var data

            data = await api.editUsername(id, newUsername)

            console.log(data)

            if(data.errorCode === 0){
                message.success('修改成功！')

                setTimeout(function(){
                    window.location.reload();
                }, 1800);
            }
            else{
                message.error('用户名重复，修改失败！')
            }
        }


        //setIsModalOpen(false);
    };

    const handleCancel = () => {
        setNewUsername('')
        setIsModalOpen(false);
    };

    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 20 },
    };

    const fetchAccount = async() => {
        if(loginType === 'Account'){
            const data = await api.getAccount(id)
            setUsername(data.data[0].username)
            setGender(data.data[0].gender)
            setDate(data.data[0].join_date)
            console.log(data)
        }
    }

    const fetchAdmin = async() => {
        if(loginType === 'Admin'){
            console.log('admin')
            const data = await api.getAdmin(id)
            setUsername(data.data[0].username)
            setGender(data.data[0].gender)
            setDate(data.data[0].join_date)
            console.log(data)
        }
    }

    useEffect(() => {
        const getAccount = async() => {
            const accountFromServer = await fetchAccount()
            setAccount(accountFromServer)
        }

        getAccount()
    }, [])

    useEffect(() => {
        const getAdmin = async() => {
            const adminFromServer = await fetchAdmin()
            setAdmin(adminFromServer)
        }

        getAdmin()
    }, [])

    if(loginType === 'Admin'){
        return (
            <div className="profile-info-box">
                <Header />
                
                <div className="profile-box">
                <Card
                    title="账号信息"
                    style={{
                        width:500,
                    }}
                    >
                    <Form {...formItemLayout}>
                        <Form.Item label="用户名">
                            <Space>
                                <Form.Item
                                name="username"
                                noStyle
                                rules={[
                                    {
                                    required: true,
                                    message: 'Username is required',
                                    },
                                ]}
                                >
                                <Input
                                    disabled={true}
                                    prefix={<UserOutlined />}
                                    placeholder={username}
                                    defaultValue={username}
                                    variant='borderless'
                                />
                                </Form.Item>

                                <Tooltip title="修改用户名">
                                    <Typography.Link onClick={showEditModal}>修改</Typography.Link>
                                </Tooltip>

                                <Modal title="修改用户名" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                                    footer={[<Button key="back" onClick={handleCancel}>
                                        取消
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={handleOk}>
                                        确认
                                    </Button>,]}>
                                    <Typography.Title level={5}>新用户名：</Typography.Title>
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder={username}
                                        value={newUsername}
                                        onChange={event => setNewUsername(event.target.value)}
                                    />
                                </Modal>
                            </Space>
                        </Form.Item>
                        
    
                        <Form.Item
                            label="加入日期"
                            name="date_joined"
                        >
                            <Input 
                                disabled={true}
                                prefix={<CalendarOutlined />}
                                placeholder={date}
                                variant='borderless'
                                />
                        </Form.Item>
                        
                        <Form.Item
                            label="性别"
                            name="gender"
                        >
                            <Space>
                                {(gender === 'man')?(
                                        <Input 
                                        disabled={true}
                                        prefix={<ManOutlined />}
                                        placeholder={gender}
                                        variant='borderless'
                                    />):(
                                        <Input 
                                        disabled={true}
                                        prefix={<WomanOutlined />}
                                        placeholder={gender}
                                        variant='borderless'
                                        />)
                                }

                                <Tooltip title="修改性别">
                                    <Typography.Link onClick={showEditModal2}>修改</Typography.Link>
                                </Tooltip>

                                <Modal title="修改性别" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}
                                    footer={[<Button key="back" onClick={handleCancel2}>
                                        取消
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={handleOk2}>
                                        确认
                                    </Button>,]}>
                                    <Typography.Title level={5}>性别：</Typography.Title>
                                    <Tooltip  placement="right" title='请选择您的性别！'>
                                        <Radio.Group 
                                            onChange={event => setGender(event.target.value)} 
                                            value={gender}>
                                        <Radio value={'man'}>男</Radio>
                                        <Radio value={'woman'}>女</Radio>
                                        </Radio.Group>
                                    </Tooltip>
                                </Modal>
                            </Space>
                        </Form.Item>
    
                            <Form.Item wrapperCol={{ offset: 7 }}>
                                <Flex gap="large" wrap="wrap">
                                    <Button type="primary" onClick={showEditModal1}>
                                    修改密码
                                    </Button>

                                    <Modal title="修改密码" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}
                                        footer={[<Button key="back" onClick={handleCancel1}>
                                            取消
                                        </Button>,
                                        <Button key="submit" type="primary" onClick={handleOk1}>
                                            确认
                                        </Button>,]}>
                                        <Typography.Title level={5}>修改密码：</Typography.Title>
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder='请输入新密码'
                                            value={password}
                                            onChange={event => setPassword(event.target.value)}
                                        />
                                        <br />
                                        <br />
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder='请输入确认密码'
                                            value={password1}
                                            onChange={event => setPassword1(event.target.value)}
                                        />
                                    </Modal>

                                    <Popconfirm
                                        title="注销账户"
                                        description="您确认要注销账户吗?"
                                        onConfirm={confirm}
                                        onCancel={cancel}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="primary" danger>
                                            注销账号
                                        </Button>
                                    </Popconfirm>

                                </Flex>
                            </Form.Item>
                        </Form>  
                    </Card>
                </div>
                
                <Footer />
            </div>
        )
    }

    return (
        <div className="profile-info-box">
            <Header />
            
            <div className="profile-box">
            <Card
                title="账号信息"
                style={{
                    width:500,
                }}
                >
                <Form {...formItemLayout}>
                    <Form.Item label="用户名">
                        <Space>
                            <Form.Item
                            name="username"
                            noStyle
                            rules={[
                                {
                                required: true,
                                message: 'Username is required',
                                },
                            ]}
                            >
                            <Input
                                disabled={true}
                                prefix={<UserOutlined />}
                                placeholder={username}
                                defaultValue={username}
                                variant='borderless'
                            />
                            </Form.Item>

                            <Tooltip title="修改用户名">
                                <Typography.Link onClick={showEditModal}>修改</Typography.Link>
                            </Tooltip>

                            <Modal title="修改用户名" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                                footer={[<Button key="back" onClick={handleCancel}>
                                    取消
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleOk}>
                                    确认
                                </Button>,]}>
                                <Typography.Title level={5}>新用户名：</Typography.Title>
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder={username}
                                    value={newUsername}
                                    onChange={event => setNewUsername(event.target.value)}
                                />
                            </Modal>
                        </Space>
                    </Form.Item>
                    

                        <Form.Item
                            label="加入日期"
                            name="date_joined"
                        >
                            <Input 
                                disabled={true}
                                prefix={<CalendarOutlined />}
                                placeholder={date}
                                variant='borderless'
                                />
                        </Form.Item>

                        <Form.Item
                            label="性别"
                            name="gender"
                        >
                            {(gender === 'man')?(
                                        <Input 
                                        disabled={true}
                                        prefix={<ManOutlined />}
                                        placeholder={gender}
                                        variant='borderless'
                                    />):(
                                        <Input 
                                        disabled={true}
                                        prefix={<WomanOutlined />}
                                        placeholder={gender}
                                        variant='borderless'
                                        />)
                                }
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 7 }}>
                            <Flex gap="large" wrap="wrap">
                                <Button type="primary" onClick={showEditModal1}>
                                修改密码
                                </Button>

                                <Modal title="修改密码" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}
                                    footer={[<Button key="back" onClick={handleCancel1}>
                                        取消
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={handleOk1}>
                                        确认
                                    </Button>,]}>
                                    <Typography.Title level={5}>修改密码：</Typography.Title>
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder='请输入新密码'
                                        value={password}
                                        onChange={event => setPassword(event.target.value)}
                                    />
                                    <br />
                                    <br />
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder='请输入确认密码'
                                        value={password1}
                                        onChange={event => setPassword1(event.target.value)}
                                    />
                                </Modal>

                                <Popconfirm
                                    title="注销账户"
                                    description="您确认要注销账户吗?"
                                    onConfirm={confirm}
                                    onCancel={cancel}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="primary" danger>
                                       注销账号
                                    </Button>
                                </Popconfirm>

                            </Flex>
                        </Form.Item>
                        
                    </Form>  
                </Card>
            </div>
            
            <Footer />
        </div>
    )

}
export default ProfilePage