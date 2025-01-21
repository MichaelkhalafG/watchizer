import React, { useContext } from 'react';
import { MyContext } from "../../../App";
import { Link } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FaRegHeart, FaLanguage } from 'react-icons/fa';
import { RiBillLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { IoIosPerson, IoIosLogOut } from "react-icons/io";
import logo from '../../../assets/images/logo.webp';

export default function ProfileSpeedPhone() {
    const { language, setLanguage } = useContext(MyContext);

    function toggleLang() {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    }

    const actions = [
        { icon: <IoIosPerson />, name: language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile', to: '/edit-profile' },
        { icon: <FaRegHeart />, name: language === 'ar' ? 'قائمة الأمنيات' : 'Wish List', to: '/wish-list' },
        { icon: <RiBillLine />, name: language === 'ar' ? 'قائمة الطلبات' : 'Order List', to: '/order-list' },
        {
            icon: <FaLanguage />,
            name: language === 'ar' ? 'تغيير اللغة' : 'Language',
            onClick: toggleLang,
        },
        { icon: <IoIosLogOut />, name: language === 'ar' ? 'تسجيل الخروج' : 'Log Out', to: '/logout' },
    ];

    return (
        <div className="col-12 p-3 d-flex sticky-top" sx={{ position: 'relative', zIndex: 1000 }}>
            <img
                src={logo}
                alt="logo"
                className="col-3"
                style={{ height: 'fit-content' }}
            />
            <SpeedDial
                ariaLabel="Profile actions"
                sx={{
                    position: 'absolute',
                    right: 16,
                    zIndex: 1000,
                    '& .MuiFab-primary': {
                        backgroundColor: '#262626FF',
                        color: '#fff',
                    },
                    '& .MuiSpeedDialAction-fab': {
                        backgroundColor: '#262626FF',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#333333',
                        },
                    },
                    '& .MuiSpeedDialAction-staticTooltipLabel': {
                        backgroundColor: '#444',
                        color: '#fff',
                    },
                }}
                direction="down"
                icon={<IoPersonSharp />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={
                            action.to ? (
                                <Link to={action.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {action.icon}
                                </Link>
                            ) : (
                                <span style={{ color: 'inherit', cursor: 'pointer' }} onClick={action.onClick}>
                                    {action.icon}
                                </span>
                            )
                        }
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </div>
    );
}
