import React from "react";
import {Menu} from "antd";

const SiderContent: React.FC = () => {
    return (
        <>
            <h3 style={{marginBottom: 16}}>Project_name</h3>
            {/* Example menu (customize as needed) */
            }
            <Menu mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">Dashboard</Menu.Item>
                <Menu.Item key="2">Issues</Menu.Item>
                <Menu.Item key="3">Settings</Menu.Item>
            </Menu>
        </>
    )
}
export default SiderContent;