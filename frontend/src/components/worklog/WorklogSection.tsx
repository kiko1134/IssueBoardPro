import React, {useEffect} from "react";
import {Avatar, Card, Collapse, List, message, Spin, Typography} from "antd";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import {useWorklog} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


interface WorklogSectionProps {
    projectId: number;
    reloadKey?: number;
}

const WorklogSection: React.FC<WorklogSectionProps> = observer(({
                                                           projectId,
                                                           reloadKey,
                                                       }) => {
    const worklog = useWorklog();

    useEffect(() => {
        worklog.load(projectId).catch(() => {
            message.error("Failed to load worklog summary or details");
        });
    }, [projectId, reloadKey, worklog]);

    if (!worklog.initialized || worklog.loadingSummary) {
        return <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}>
            <Spin style={{margin: "auto"}}/>
        </div>;
    }

    // if (worklog.loadingSummary) return <Spin style={{margin: "auto"}}/>;

    const items = worklog.summary.map((item) => {
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

        const children = worklog.loadingDetails ? (
            <Spin/>
        ) : (
            <List
                dataSource={worklog.getDetails(item.id)}
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
            {worklog.summary.length === 0 ? (
                <Typography.Text>No worklog entries yet</Typography.Text>
            ) : (
                <Collapse items={items}/>
            )}
        </Card>
    );
});

export default WorklogSection;
