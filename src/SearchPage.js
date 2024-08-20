import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import Footer from './Components/Footer'
import Header from './Components/Header'
import Graph from './Components/Graph';
import './SearchPage.css'

const SearchPage = () => {
    let {value} = useParams()
    const textId = '116'

    return(
        <div className='main-page'>
            <div className='main-header-design'>
                <Header />
            </div>

            <div className='search-title-design'>
                    <Typography.Title type="danger" level={5}>搜索结果</Typography.Title>

                    <Graph textId={textId}/>
            </div>

            <div className='main-footer-design'>
                <Footer />
            </div>
        </div>
    )
}

export default SearchPage