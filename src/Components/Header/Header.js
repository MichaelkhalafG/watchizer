import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.webp';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdowen';
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import './Header.css';
import SearchBox from './SearchBox/SearchBox';
import { Button } from '@mui/material';
import Nav from './Nav/Nav';
import userimg from '../../assets/images/user.webp'
import { MyContext } from '../../App';

function Header() {
    const { language, productsCount, users, user_id, total_cart_price } = useContext(MyContext);

    return (
        <>
            <div className="header-strip border-bottom border-1 pb-3 lato-regular" >
                <div className="top-strip bg-most-used">
                    <div className="container">
                        <p className="m-0 py-1 text-center text-light">
                            {language === 'ar' ? 'موقع وتشيزر في خدمتكم' : 'Watchizer website is at your service'}
                        </p>
                    </div>
                </div>
                <div className="header pt-2">
                    <div className="container-fluid px-5 py-3">
                        <div className="row">
                            <div className="logo d-flex justify-content-center col-sm-2">
                                <Link to={'/'} className='d-flex justify-content-center'>
                                    <img src={logo} loading='lazy' alt="Watchizer-logo" className='col-6' />
                                </Link>
                            </div>
                            <div className="col-sm-10 d-flex align-items-center">
                                <LanguageDropdown />
                                <SearchBox />
                                <div className='d-flex mx-auto align-items-center'>
                                    <span className='m-3 price color-most-used' style={{ fontSize: "18px", fontWeight: "700", }}>
                                        {users.find(u => u.id === user_id)?.name}
                                    </span>
                                    <img
                                        src={userimg}
                                        alt='user'
                                        className='rounded-circle d-flex justify-content-center border border-1 align-items-center justify-content-center' style={{ width: "45px", height: "45px", minWidth: "45px" }} />
                                    <div className='m-auto cart-tap d-flex align-items-center'>
                                        <span className='m-3 price color-most-used' style={{ fontSize: "18px", fontWeight: "700", }}>
                                            {productsCount === 0 ? "0.00" : total_cart_price}{language === 'ar' ? ' ج.م ' : ' EG '}
                                        </span>
                                        <Link className='position-relative ' to={'/cart'}>
                                            <Button className='rounded-circle border border-0 align-items-center justify-content-center' style={{ width: "45px", height: "45px", minWidth: "45px" }}>
                                                <IoBagOutline style={{ fontSize: "22px" }} className='color-most-used' />
                                            </Button>
                                            <span className='position-absolute start-100 translate-middle badge rounded-pill' style={{ background: "#ea2b0f", top: "5px" }}>
                                                {productsCount}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Nav />
            </div>
        </>
    );
}

export default Header;
