import {useState, useEffect} from 'react'
import api from './Components/Api'
import Graph from './Components/Graph';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Modal, Button, message, Typography, Table, Space, Popconfirm } from 'antd';
import './FileList.css'

const checkAction = async(fileId) => {
    console.log(fileId)

}

const deleteAction = async(fileId) => {
    console.log(fileId)

    var data

    data = api.deleteFile(fileId)
    //console.log(data.errorCode)

    message.success('删除成功!')
    setTimeout(function(){
        window.location.reload();
    }, 1800);
}

const FileList = () => {
    const [fileList, setFileList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInfo = useState('')
    
    const showModal = async(id) => {
        console.log(id)
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
            title: '文件',
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <a href={record.file_url} download>{name}</a>
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
                        title='删除文件'
                        description='确认删除文件吗？'
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


    const fetchFileList = async() => {
        const data = await api.getFileList()
        console.log(data.data)
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
        const getFileList = async() => {
            const fileListFromServer = await fetchFileList()
            setFileList(fileListFromServer)
        }

        getFileList()
    }, [])

    return (
        <div>
            <Header/>
            <div className='file-list-box'>
                <div className='file-box-title-design'>
                    <Typography.Title type="danger" level={5}>文件上传历史记录</Typography.Title>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={fileList}
                    pagination={{position: ['none', 'bottomCenter']}} />
            
                <Modal 
                    open={isModalOpen} 
                    onOk={handleOk}
                    onCancel={handleOk}
                    centered
                    width={1000}
                    footer={[
                        <Button type='primary' key='back' onClick={handleOk}>
                            确认
                        </Button>
                    ]}>
                    {/* <Graph fileId = {fileId}/> */}
                </Modal>
            </div>
            <Footer/>
        </div>
   )
}

export default FileList