import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from './Components/Api';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Graph from './Components/Graph';
import ChatBoxPage from './ChatBoxPage';
import '@chatui/core/dist/index.css';
import './ChatPage.css'
import { PlusCircleOutlined, FileTextOutlined, FileOutlined, SearchOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Row, Col, Input, Modal, Typography, Card, Button, message, Upload, Table, Alert, Space, Tabs } from 'antd';
const { Text } = Typography
const { TextArea } = Input

const EllipsisMiddle = ({ children }) => {
    const start = children.slice(0, 15);
    const suffix = '...';
    const displayedText = start + suffix;

    return (
      <Text
        style={{
          maxWidth: '100%',
        }}
        ellipsis={{
          suffix,
        }}
      >
        {displayedText}
      </Text>
    );
};


const ChatPage = () => {
    let {id, type} = useParams()
    const navigate = useNavigate()
    const username = Cookies.get('username')
    const [textList, setTextList] = useState([])
    const [text, setText] = useState([])
    const [open, setOpen] = useState(false);
    const [id2, setId2] = useState(0)
    const [fileList, setFileList] = useState([])
    const [tabKey, setTabKey] = useState('tab1')
    const [authorId, setAuthorId] = useState([])

    const onTabChange = (key) => {
        setTabKey(key)
    }

    const handleClick = (textId, ty) => {
        navigate(`/chatbox/${ty}/${textId}`)
    }

    const showModal = (textId) => {
        setId2(textId)
        setOpen(true);
    };

    const handleOk = (e) => {
        console.log(e);
        setOpen(false);
    };

    const handleCancel = (e) => {
        console.log(e);
        setOpen(false);
    };

    const tabList = [
        {
            icon: <FileTextOutlined />,
            key: "tab1",
            label: "文本",
            children: 
            <div>
            {textList.length > 0 ? textList.map((text, index) => (
                <Card 
                    className='text-history-card-design' 
                    type='inner' 
                    actions={[
                        <SearchOutlined onClick={event => handleClick(text.id, 'text')}/>,
                        <DeleteOutlined onClick={event => showModal(text.id)}/>
                    ]}>
                        <Modal
                            title="删除文本"
                            open={open}
                            onOk={event => deleteTextAction(text.id)}
                            onCancel={handleCancel}
                            okText='确认'
                            cancelText='取消'>
                            <p>确认删除文本吗？</p>
                        </Modal>
                    <Space direction='vertical'>
                        <Space>
                            <Text code>{text.created_by}</Text>
                            <Text code>文本</Text>
                        </Space>
                        
                        <EllipsisMiddle>
                            {text.text}
                        </EllipsisMiddle>
                        <Text type='danger'>{text.created_at}</Text>
                    </Space>
                </Card>
            )): <h2>暂无文本记录</h2>}
        </div>,
        },
        {
            icon: <FileOutlined />,
            key: "tab2",
            label: "文件",
            children:
            <div>
            {fileList.length > 0 ? fileList.map((file, index) => (
            <Card 
                className='text-history-card-design' 
                type='inner' 
                actions={[
                    <SearchOutlined onClick={event => handleClick(file.id, 'file')}/>,
                    <DeleteOutlined onClick={event => showModal(file.id)}/>
                ]}>
                    <Modal
                        title="删除文件"
                        open={open}
                        onOk={event => deleteFileAction(file.id)}
                        onCancel={handleCancel}
                        okText='确认'
                        cancelText='取消'>
                        <p>确认删除文件吗？</p>
                    </Modal>
                <Space direction='vertical'>
                    <Space>
                        <Text code>{file.created_by}</Text>
                        <Text code>文件</Text>
                    </Space>
                    <a href={file.file_url} download>{file.name}</a>
                    <Text type='danger'>{file.created_at}</Text>
                </Space>
            </Card>
            )): <h2>暂无文件记录</h2>}
        </div>,
        }
    ]

    const fetchTextList = async() => {
        const data = await api.getTextList()
        console.log(data.data)
        return data.data
    } 

    const fetchFileList = async() => {
        const data = await api.getFileList()
        console.log(data.data)
        console.log("id:" + id)
        const fileInfo = data.data.map(file => ({
            id: file.info.id,
            created_by: file.info.created_by,
            created_at: file.info.created_at,
            file_url: file.file_url,
            name: file.info.name,
        }))
        return fileInfo
    } 

    useEffect(() => {
        const getTextList = async() => {
            const textListFromServer = await fetchTextList()
            setTextList(textListFromServer)
        }

        getTextList()
    }, [])

    useEffect(() => {
        const getFileList = async() => {
            const fileListFromServer = await fetchFileList()
            setFileList(fileListFromServer)
        }

        getFileList()
    }, [])

    const deleteFileAction = async(fileId) => {
        console.log(fileId)
    
        var data
        data = await api.deleteFile(fileId)

        console.log(data.errorCode)

        if (data.errorCode === 400) {
            message.error('无权限删除！')
            setOpen(false)
        }
        else {
            message.success('删除成功!')
            setFileList((prevList) => prevList.filter((file) => file.id !== fileId));
            navigate(`/chatbox/text/0`)
            setOpen(false)
        }
    }

    const deleteTextAction = async() => {
        console.log(username)
        var data

        data = await api.deleteText(id2)

        console.log(data.errorCode)

        if (data.errorCode === 400) {
            message.error('无权限删除！')
            setOpen(false)
        }
        else {
            message.success('删除成功!')
            setTextList((prevList) => prevList.filter((text) => text.id !== id2));
            setOpen(false)
        }
    }

    return (
        <div className='whole-chat-page-design'>
            <Header/>
            <div className='alert-box-design'>
                <Alert
                    message="请上传文本、三元组或文件。" 
                    type="info" 
                    style={{width: 400}}
                    showIcon closable/>
            </div>
            <Space className='space-design' type='horizontal'>
                <div className='card-tab-design'>
                    <Card 
                        style={{
                            height: 650,
                        }}
                        className='history-list-design' 
                        extra={<PlusCircleOutlined onClick={event => handleClick(0, 'text')}/>}
                        title='上传记录'>
                        <Tabs 
                            defaultActiveKey='1'
                            centered
                            items={tabList}
                            />
                    </Card>
                </div>

                <div>
                    <Card 
                        className='chat-box-design'
                        style={{
                            width: 840,
                            height: 650,
                        }}>
                            {id === '0' ? 
                            
                            <ChatBoxPage />
                                                   
                            
                            : <Graph type = {type} textId = {id}/>}
                    </Card>
                </div>
            </Space>
            
            <Footer/>
        </div>
    );
}

export default ChatPage