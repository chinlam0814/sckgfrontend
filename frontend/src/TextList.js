import {useState, useEffect} from 'react'
import api from './Components/Api'
import Graph from './Components/Graph';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Modal, Button, message, Typography, Table, Space, Popconfirm } from 'antd';
import './TextList.css'

const checkAction = async(textId) => {
    console.log(textId)

}

const deleteAction = async(textId) => {
    if (textId === 116) {
        message.error('此文本不能删除！')
    }
    else {
        var data

        data = api.deleteText(textId)
    
        message.success('删除成功!')
        setTimeout(function(){
            window.location.reload();
        }, 1800);
    }
}

const TextList = () => {
    const [textList, setTextList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [textId, setTextId] = useState()
    
    const showModal = async(id) => {
        console.log(id)
        setTextId(id)
        setIsModalOpen(true);
    };

    const cancel = (e) => {

    }
    
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: '上传人',
            align: 'center',
            width: 200,
            dataIndex: 'created_by',
            key: 'created_by',
            renderItem: (username) => <a>{username}</a>
        },
        {
            title: '日期',
            align: 'center',
            width: 150,
            dataIndex: 'created_at',
            key: 'created_at',
            renderItem: (date) => <a>{date}</a>
        },
        {
            title: '文本',
            align: 'center',
            dataIndex: 'text',
            key: 'text',
            renderItem: (text) => <a>{text}</a>
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 150,
            render: (_, record) => (
                
                <Space size="middle">
    
                    <a key="checkAction" onClick={()=> {showModal(record.id)}}>查看</a>
                    <Popconfirm
                        title='删除文本'
                        description='确认删除文本吗？'
                        onConfirm={() => {deleteAction(record.id)}}
                        onCancel={cancel}
                        okText='确认'
                        cancelText='取消'>
                            <Button type='text' danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]


    const fetchTextList = async() => {
        const data = await api.getTextList()
        console.log(data.data)
        return data.data
    } 

    useEffect(() => {
        const getTextList = async() => {
            const textListFromServer = await fetchTextList()
            setTextList(textListFromServer)
        }

        getTextList()
    }, [])

    return (
        <div>
            <Header/>
            <div className='text-list-box'>
                <div className='text-box-title-design'>
                    <Typography.Title type="danger" level={5}>文本上传历史记录</Typography.Title>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={textList}
                    pagination={{position: ['none', 'bottomCenter']}} />
            
                <Modal 
                    open={isModalOpen} 
                    onOk={handleOk}
                    onCancel={handleOk}
                    centered
                    width={1000}
                    style={{height: 500}}
                    footer={[
                        <Button type='primary' key='back' onClick={handleOk}>
                            确认
                        </Button>
                    ]}>
                    <Graph textId = {textId}/>
                </Modal>
            </div>
            <Footer/>
        </div>
   )
}

export default TextList