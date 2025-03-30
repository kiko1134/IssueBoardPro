import React from "react";
import {Menu} from "antd";
import {BarChartOutlined, ClockCircleOutlined, TeamOutlined} from "@ant-design/icons";

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
}

const SiderContent: React.FC<SiderContentProps> = ({projectName}) => {
    return (
        <>
            <div><h3 style={{paddingLeft: 10, marginBottom: 16, color: "white"}}>{projectName}</h3></div>
            <Menu theme="dark" items={menuItems} mode="inline"/>
        </>
    )
}
export default SiderContent;