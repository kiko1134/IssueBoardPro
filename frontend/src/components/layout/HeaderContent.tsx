import {Button, Dropdown, Menu} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";

const menuItems = [
    { label: "Project 1", key: "1" },
    { label: "Project 2", key: "2" },
    { label: "Project 3", key: "3" },
];


const HeaderContent: React.FC = () => {

    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '16px'
                }}
            >
                Issue Tracker
            </div>

            {/*<Button type="text" style={{marginRight: '16px'}}>*/}
            {/*    Projects <DownOutlined/>*/}
            {/*</Button>*/}

            <Dropdown menu={{items: menuItems}} trigger={["click"]}>
                <Button type="text" style={{ marginRight: "16px" }}>
                    Projects <DownOutlined />
                </Button>
            </Dropdown>

            <Button
                type="primary"
                icon={<PlusOutlined/>}
                style={{marginRight: '16px'}}
            >
                Create Project
            </Button>
            <Button style={{ marginLeft: 'auto' }}>CV</Button>
        </div>
    )
}

export default HeaderContent;