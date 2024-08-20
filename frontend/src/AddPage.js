import React, { useState, useEffect } from 'react';
import Footer from './Components/Footer'
import Header from './Components/Header'
import AddText from './AddText';
import AddFile from './AddFile';
import TextList from './TextList';
import Cookies from 'js-cookie';
import './AddPage.css';
import api from './Components/Api'
import { Tabs } from 'antd';
import { FolderOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons'
const items = [
    {
      key: '1',
      label: '文档',
      icon: <FolderOutlined />,
      children: <AddFile />,
    },
    {
      key: '2',
      label: '文本',
      icon: <FileTextOutlined />,
      children: <AddText />,
    },
    {
        key: '3',
        label: '历史记录',
        icon: <HistoryOutlined />,
        children: <TextList />,
    },
  ];

const AddPage = () => {
    const id = Cookies.get('id')
    let loginType = Cookies.get('user')
    
    return(
        <div className='add-file-page'>
            <div className='add-file-header-design'>
                <Header />
            </div>

            <div className='add-tab-design'>
                <Tabs
                    centered
                    size='large'
                    destroyInactiveTabPane={true}
                    items={items}
                >
                </Tabs>
            </div>

            <div className='add-file-footer-design'>
                <Footer />
            </div>
        </div>
    )
}

export default AddPage