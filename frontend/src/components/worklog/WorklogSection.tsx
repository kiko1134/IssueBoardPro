import React, {useEffect, useState} from "react";
import {Avatar, Card, Collapse, List, message, Spin, Typography} from "antd";
import {fetchProjectWorklogs} from "../../api/services/issueService";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import {fetchUserWorklogs} from "../../api/services/worklogService";

interface UserWorklog {
    id: number;
    username: string;
    totalMinutes: number;
}

interface WorklogSectionProps {
    projectId: number;
    reloadKey?: number;
}

interface WorkLogDetail {
    issueId: number;
    issueTitle: string;
    minutes: number;
    createdAt: string;
}

const WorklogSection: React.FC<WorklogSectionProps> = ({
                                                           projectId,
                                                           reloadKey,
                                                       }) => {
    const [loading, setLoading] = useState(true);
    const [worklogs, setWorklogs] = useState<UserWorklog[]>([]);

    const [details, setDetails] = useState<Record<number, WorkLogDetail[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetchProjectWorklogs(projectId)
            .then(async (data) => {
                setWorklogs(data);
                setLoadingDetails(true);
                const detailPromises = data.map((user) =>
                    fetchUserWorklogs(projectId, user.id).then((rows) => [user.id, rows] as [number, WorkLogDetail[]])
                );
                const entries = await Promise.all(detailPromises);
                const allDetails: Record<number, WorkLogDetail[]> = {};
                entries.forEach(([userId, rows]) => {
                    allDetails[userId] = rows;
                });
                setDetails(allDetails);
            })
            .catch((err) => {
                console.error(err);
                message.error("Failed to load worklog summary or details");
            })
            .finally(() => {
                setLoading(false);
                setLoadingDetails(false);
            });
    }, [projectId, reloadKey]);


    if (loading) return <Spin style={{margin: "auto"}}/>;

    const items = worklogs.map((item) => {
        const hours = Math.floor(item.totalMinutes / 60);
        const minutes = item.totalMinutes % 60;
        const color = AVATAR_COLORS[item.id % AVATAR_COLORS.length];

        const header = (
            <div style={{display: "flex", alignItems: "center"}}>
                <Avatar style={{backgroundColor: color, marginRight: 8}}>
                    {item.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography.Text strong style={{flex: 1}}>
                    {item.username}
                </Typography.Text>
                <Typography.Text>
                    {hours}h {minutes}m
                </Typography.Text>
            </div>
        );

        const children = loadingDetails ? (
            <Spin/>
        ) : (
            <List
                dataSource={details[item.id] || []}
                renderItem={(d) => {
                    const h = Math.floor(d.minutes / 60);
                    const m = d.minutes % 60;
                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <>
                                        <Typography.Text>{d.issueTitle}</Typography.Text>
                                        <Typography.Text type="secondary" style={{marginLeft: 8}}>
                                            ({h}h {m}m)
                                        </Typography.Text>
                                    </>
                                }
                                description={new Date(d.createdAt).toLocaleString()}
                            />
                        </List.Item>
                    );
                }}
            />
        );

        return {
            key: item.id.toString(),
            label: header,
            children,
        };
    });

    return (
        <Card title="Worklog Summary" style={{height: "100%"}}
              styles={{body: {height: "calc(100% - 48px)", overflowX: "auto"}}}>
            {worklogs.length === 0 ? (
                <Typography.Text>No worklog entries yet</Typography.Text>
            ) : (
                <Collapse items={items}/>
            )}
        </Card>
    );
};

export default WorklogSection;
