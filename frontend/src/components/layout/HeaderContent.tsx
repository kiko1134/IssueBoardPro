import {Button, Dropdown} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";

const menuItems = [
    {label: "Project 1", key: "1"},
    {label: "Project 2", key: "2"},
    {label: "Project 3", key: "3"},
];

interface HeaderContentProps {
    onProjectSelect: (projectName: string) => void;
}


const HeaderContent: React.FC<HeaderContentProps> = ({onProjectSelect}) => {

    const handleMenuClick = (info: any) => {
        const selected = menuItems.find(item => item.key === info.key);
        if (selected) {
            onProjectSelect(selected.label);
        }
    };

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

            <Dropdown menu={{items: menuItems, onClick: handleMenuClick}} trigger={["click"]}>
                <Button type="text" style={{marginRight: "16px"}}>
                    Projects <DownOutlined/>
                </Button>
            </Dropdown>

            <Button
                type="primary"
                icon={<PlusOutlined/>}
                style={{marginRight: '16px'}}
            >
                Create Project
            </Button>
            <Button style={{marginLeft: 'auto'}}>CV</Button>
        </div>
    )
}

export default HeaderContent;