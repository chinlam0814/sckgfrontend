import React, { useState } from 'react';
import './AddText.css'
import Header from './Components/Header';
import Footer from './Components/Footer';
import api from './Components/Api';
import Cookies from 'js-cookie';
import { Input, Button, Typography, message } from 'antd';

const { TextArea } = Input;

const AddText = () => {
    const username = Cookies.get('username')
    let loginType = Cookies.get('user')
    const [value, setValue] = useState('');

    const handleUploadText = async(e) => {
        console.log(value)
        console.log(username)
        
        var data
        message.info('上传中，请稍等！', 12)
        data = await api.createText(value, username)
        //console.log(user.data[0])
        

        if(data.errorCode === 0){
            message.success('上传成功！')
            setValue('')
        }
        else{
            message.error('上传失败，请重新上传！')
        }
    }
    
    return(
        <div className='add-text'>
            <Header />
            <div className='add-text-box-design' >
                <Typography.Title type="danger" level={5}>上传文本</Typography.Title>
                <TextArea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="请输入文本..."
                    allowClear
                    maxLength={500}
                    showCount
                    autoSize={{ minRows: 10, maxRows: 20 }}
                />
            </div>

            <div className='add-text-box-button'>
                <Button type="primary" disabled={value.length === 0} onClick={handleUploadText}>提交</Button>
            </div>
            <Footer />
        </div>
    )
}

export default AddText