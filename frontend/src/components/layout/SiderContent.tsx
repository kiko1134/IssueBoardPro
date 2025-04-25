import React from "react";
import {Menu, Typography} from "antd";
import {BarChartOutlined, ClockCircleOutlined, TeamOutlined} from "@ant-design/icons";

const {Title} = Typography;

const menuItems = [
    {
        label: 'Members',
        key: '1',
        icon: <TeamOutlined/>
    },
    {
        label: 'Worklog',
        key: '2',
        icon: <ClockCircleOutlined/>
    },
    {
        label: 'Stats',
        key: '3',
        icon: <BarChartOutlined/>
    },
];

interface SiderContentProps {
    projectName: string;
    icon?: React.ReactNode;
    collapsed?: boolean;
}

const SiderContent: React.FC<SiderContentProps> = ({projectName, icon, collapsed}) => {
    return (
        // <>
        //     <div><h3 style={{paddingLeft: 10, marginBottom: 16, color: "white"}}>{projectName}</h3></div>
        //     <Menu theme="dark" items={menuItems} mode="inline"/>
        // </>
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <div
                style={{
                    padding: "16px 8px",
                    textAlign: "center",
                }}
            >
                {collapsed ? (
                    <div style={{fontSize: 24, color: "white"}}>{icon}</div>
                ) : (
                    <Title level={4} style={{color: "white", margin: 0}}>
                        {projectName}
                    </Title>
                )}
            </div>

            {/* Menu */}
            <Menu
                theme="dark"
                mode="inline"
                items={menuItems}
                style={{flex: 1, paddingLeft: collapsed ? 0 : 20}}
            />
        </div>
    )
}
export default SiderContent;