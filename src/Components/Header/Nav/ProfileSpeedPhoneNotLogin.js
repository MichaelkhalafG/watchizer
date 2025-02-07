import React, { useContext } from 'react';
import { MyContext } from "../../../App";
import { Link } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FaLanguage } from 'react-icons/fa';
import { IoPersonSharp } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import logo from '../../../assets/images/logo.webp';

export default function ProfileSpeedPhoneNotLogin() {
    const { language, setLanguage } = useContext(MyContext);

    function toggleLang() {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    }

    const actions = [
        {
            icon: <FaLanguage />,
            name: language === 'ar' ? 'تغيير اللغة' : 'Language',
            onClick: toggleLang,
        },
        { icon: <IoMdLogIn />, name: language === 'ar' ? 'تسجيل الدخول' : 'Log in', to: '/login' },
    ];

    return (
        <div className="col-12 p-3 d-flex sticky-top" sx={{ position: 'relative', zIndex: 1000 }}>
            <img src={logo} alt="logo" className="logo" style={{ height: "50px", maxWidth: "150px" }} />
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
