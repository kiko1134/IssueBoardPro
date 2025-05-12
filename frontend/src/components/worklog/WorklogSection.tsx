import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import React from "react";
import {Avatar, Card, List,Typography} from "antd";

interface UserWorklog {
    id: number;
    username: string;
    totalMinutes: number;
}

// Mocked data until backend is ready
const mockedWorklogs: UserWorklog[] = [
    { id: 1, username: 'Ivan', totalMinutes: 320 },
    { id: 2, username: 'Martin', totalMinutes: 210 },
    { id: 3, username: 'Georgi', totalMinutes: 480 },
];


const WorklogSection: React.FC = () => {
    return (
        <Card title="Worklog Summary" style={{ marginTop: 16 }}>
            <List<UserWorklog>
                dataSource={mockedWorklogs}
                renderItem={item => {
                    // Convert minutes to hours and minutes
                    const hours = Math.floor(item.totalMinutes / 60);
                    const minutes = item.totalMinutes % 60;
                    const color = AVATAR_COLORS[item.id % AVATAR_COLORS.length];

                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }}>
                                        {item.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={
                                    <Typography.Text strong style={{ marginRight: 16 }}>
                                        {item.username}
                                    </Typography.Text>
                                }
                                description={<Typography.Text>{hours}h {minutes}m</Typography.Text>}
                            />
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};

export default WorklogSection;