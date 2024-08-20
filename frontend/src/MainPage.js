import React from 'react';
import Footer from './Components/Footer'
import Header from './Components/Header'
import WholeGraph from './WholeGraph';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import api from './Components/Api';

const MainPage = () => {
    const id = Cookies.get('id')
    let loginType = Cookies.get('user')
    const textId = '116'
    console.log(id)

    if(loginType === 'Account'){
        return(
            <div className='main-page'>
                <div className='main-header-design'>
                    <Header />
                </div>
                <div>
                    <WholeGraph textId={textId}/>
                </div>
    
                <div className='main-footer-design'>
                    <Footer />
                </div>
            </div>
        )
    }
    else if(loginType === 'Admin'){
        return(
            <div className='main-page'>
                <div className='main-header-design'>
                    <Header />
                </div>
                <div>
                    <WholeGraph textId={textId}/>
                </div>
    
                <div className='main-footer-design'>
                    <Footer />
                </div>
            </div>
        )
    }

    return(
        
        <div className='main-page'>
            <div className='main-header-design'>
                <Header />
            </div>

            <div>
                <WholeGraph textId={textId}/>
            </div>

            <div className='main-footer-design'>
                <Footer />
            </div>
        </div>
    )
}

export default MainPage