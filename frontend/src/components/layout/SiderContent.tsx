import React from "react";
import {Menu, Typography} from "antd";
import {BarChartOutlined, ClockCircleOutlined, TeamOutlined} from "@ant-design/icons";

const {Title} = Typography;

const menuItems = [
    {label: "Board", key: "board", icon: <BarChartOutlined/>},
    {label: "Members", key: "members", icon: <TeamOutlined/>},
    {label: "Worklog", key: "worklog", icon: <ClockCircleOutlined/>},
];

interface SiderContentProps {
    projectName: string;
    icon?: React.ReactNode;
    collapsed?: boolean;
    onMenuSelect: (key: string) => void;
    activeKey: string;
}

const SiderContent: React.FC<SiderContentProps> = ({projectName, icon, collapsed, onMenuSelect, activeKey}) => {
    return (
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
                selectedKeys={[activeKey]}
                onClick={({key}) => onMenuSelect(key)}
                style={{flex: 1, paddingLeft: collapsed ? 0 : 20}}
            />
        </div>
    )
}
export default SiderContent;