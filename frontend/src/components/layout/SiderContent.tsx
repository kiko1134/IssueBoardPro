import React from "react";
import {Menu} from "antd";

const menuItems = [
    {
        label: 'Dashboard',
        key: '1',
    },
    {
        label: 'Issues',
        key: '2',
    },
    {
        label: 'Settings',
        key: '3',
    },
];

const SiderContent: React.FC = () => {
    return (
        <>
            <h3 style={{marginBottom: 16}}>Project_name</h3>
            <Menu items={menuItems} mode="inline" defaultSelectedKeys={['1']}/>
        </>
    )
}
export default SiderContent;