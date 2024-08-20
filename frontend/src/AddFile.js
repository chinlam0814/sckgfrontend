import React, { useState, useEffect } from 'react';
import './AddFile.css'
import api from './Components/Api';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Cookies from 'js-cookie';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Upload, Card } from 'antd';

// const props = {
//     name: 'file',
//     multiple: true,
//     action: 'http://localhost:8000/file/create/',
//     onChange(info) {
//         const { status } = info.file;
//         console.log(status)
//         if (status !== 'uploading') {
//             console.log(info.file, info.fileList);
//         }
//         if (status === 'done') {
//             message.success(`${info.file.name} file uploaded successfully.`);
//         } else if (status === 'error') {
//             message.error(`${info.file.name} file upload failed.`);
//         }
//     },
//     onDrop(e) {
//         console.log('Dropped files', e.dataTransfer.files);
//     },
// };


const AddFile = () => {
    const id = Cookies.get('id')
    const username = Cookies.get('username')
    let loginType = Cookies.get('user')
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false)

    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 20 },
    };

    const uploadAction = async() => {
        const formData = new FormData()
        formData.append('file', file);
        console.log(file)
        console.log(fileName)
        setLoading(true)

        var data

        data = await api.createFileInfo(fileName, username)
        //console.log(user.data[0])
        console.log(data.errorCode)

        if(data.errorCode === 0){
            const fileData = await api.uploadFile(data.data[0].id, formData)
            console.log(fileData)
            message.success('上传成功！')
            setLoading(false)
            setTimeout(function(){
                window.location.reload();
            }, 1800);
        }
        else{
            message.error('上传失败，请重新上传')
            setLoading(false)
        }
    }

    const handleChange = () => {
        const formData = new FormData()
        formData.append('file', file);
        console.log(file)
        //setLoading(true)
    }

    const props = {
        onRemove: () => {
            setFile(null)
        },
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
        fileList: file ? [file] : [],
    }

    return(
        <div className='add-file'>
            <Header/>
            <div className='add-file-box-design' >
                <Card
                    title="上传文件"
                    style={{
                        width:500,
                    }}
                    >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="上传文件"
                            name="file"
                            rules={[{ required: true, message: '请上传文件' }]}
                        >
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>上传文件</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="文件名"
                            name="filename"
                            rules={[{ required: true, message: '请输入文件名' }]}
                        >
                            <Input
                                id='fileNameInput'
                                allowClear
                                prefix={<FileOutlined />}
                                onChange={event => setFileName(event.target.value)}
                                placeholder="请输入文件名"/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 10 }}>
                            <Button 
                                type="primary" 
                                loading={loading}
                                disabled={!file || loading || fileName.length <= 0}
                                onClick={uploadAction}>
                                {(loading) ? '上传中' : '上传'}
                            </Button>
                        </Form.Item>
                    </Form>  
                </Card>
            </div>
            <Footer/>
        </div>
    )
}

export default AddFile