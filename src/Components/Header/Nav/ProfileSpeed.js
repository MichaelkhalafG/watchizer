import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FaRegHeart } from 'react-icons/fa';
import { RiBillLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { IoIosPerson, IoIosLogOut } from "react-icons/io";

const actions = [
    { icon: <IoIosPerson />, name: 'Edit Profile', to: '/edit-profile' },
    { icon: <FaRegHeart />, name: 'Wish List', to: '/wish-list' },
    { icon: <RiBillLine />, name: 'Order List', to: '/order-list' },
    { icon: <IoIosLogOut />, name: 'Log Out', to: '/logout' },
];

export default function ProfileSpeed() {
    return (
        <Box sx={{ position: 'relative', zIndex: 10 }}>
            <SpeedDial
                ariaLabel="Profile actions"
                sx={{
                    position: 'fixed',
                    bottom: 25,
                    left: 25,
                    '& .MuiFab-primary': {
                        backgroundColor: '#262626FF',
                        color: '#fff',
                    },
                    '& .MuiSpeedDialAction-fab': {
                        backgroundColor: '#262626AE',
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
                icon={<IoPersonSharp />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={
                            <Link to={action.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {action.icon}
                            </Link>
                        }
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
