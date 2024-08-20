import { FileTextOutlined, CommentOutlined, FileAddOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, UserOutlined, HistoryOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import api from './Api'
import { Typography, Button, Input, message } from 'antd';
import Cookies from 'js-cookie';
const { Search } = Input;
const { Link } = Typography;


const Header = () => {
    const navigate = useNavigate()
    let loginType = Cookies.get('user')

    const logoutAction = async(e) => {
        e.preventDefault()
        console.log(loginType)
        const data = await api.logout()
        
        console.log(data)

        if (data.errorCode === 403 || data.errorCode === 404) {
            console.log('not logged in yet.')
            Cookies.remove("user")
			Cookies.remove("username")
			Cookies.remove("id")
        }
        else {
            message.loading('正在登出...', 1)
            .then(() => message.success('登出成功！', 2.5))
            navigate('/')
            window.location.reload(false)
        }

        navigate('/')
        window.location.reload(false)
    }

    if (loginType === 'Admin'){
        return (
            <div className="header-design">
                <div className='icon-design'>
                    <div className='home-icon-design'>
                        <Link className='home-icon-link' href ='/'>
                            <Button className='button-design' size='large' type='text' icon={<HomeOutlined style={{fontSize: '30px'}}/>}></Button>
                        </Link>
                    </div>
    
                    <div className='right-icon-design'>
                        <div className='chat-box-icon-design'>
                            <Link className='chat-box-icon-link' href ='/chatbox/text/0'>
                                <Button className='button-design' size='large' type='text' icon={<CommentOutlined style={{fontSize: '30px'}}/>}></Button>
                            </Link>
                        </div>

                        <div className='account-icon-design'>
                            <Link className='account-icon-link' href ='/profile'>
                                <Button className='button-design' size='large' type='text' icon={<UserOutlined style={{fontSize: '30px'}}/>}></Button>
                            </Link>
                        </div>

                        <div className='logout-icon-design'>
                            <Button className='button-design' size='large' type='text' icon={<LogoutOutlined style={{fontSize: '30px'}} onClick={logoutAction}/>}></Button>
                        </div>    
                    </div>
                </div>
    
                <div className='hr-2'>
                    <hr />
                </div>
            </div>
        )
    }

    return (
        <div className="header-design">
            <div className='icon-design'>
                <div className='home-icon-design'>
                    <Link className='home-icon-link' href ='/'>
                        <Button className='button-design' size='large' type='text' icon={<HomeOutlined style={{fontSize: '30px'}}/>}></Button>
                    </Link>
                </div>

                <div className='right-icon-design'>
                    <div className='add-user-icon-design'>
                        <Link className='add-user-icon-link' href ='/adduser'>
                            <Button className='button-design' size='large' type='text' icon={<UserAddOutlined style={{fontSize: '30px'}}/>}></Button>
                        </Link>
                    </div>

                    <div className='login-icon-design'>
                        <Link className='login-icon-link' href ='/login'>
                            <Button className='button-design' size='large' type='text' icon={<LoginOutlined style={{fontSize: '28px'}}/>}></Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='hr-2'>
                <hr />
            </div>
        </div>
    )
}

export default Header