import React, {useEffect, useState} from "react";
import {Avatar, Card, List, message, Spin, Typography} from "antd";
import {fetchProjectWorklogs} from "../../api/services/issueService";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";

interface UserWorklog {
    id: number;
    username: string;
    totalMinutes: number;
}

interface WorklogSectionProps {
    projectId: number;
    reloadKey?: number;
}

const WorklogSection: React.FC<WorklogSectionProps> = ({
                                                           projectId,
                                                           reloadKey,
                                                       }) => {
    const [loading, setLoading] = useState(true);
    const [worklogs, setWorklogs] = useState<UserWorklog[]>([]);

    // useEffect(() => {
    //     setLoading(true);
    //     Promise.all([fetchTasks(projectId), fetchProjectMembers(projectId)])
    //         .then(([tasks, members]) => {
    //             const minsByUser: Record<number, number> = {};
    //             tasks.forEach((t: Task) => {
    //                 const mins = t.workLog || 0;
    //                 minsByUser[t.assignedTo] = (minsByUser[t.assignedTo] || 0) + mins;
    //             });
    //             const data: UserWorklog[] = members.map((u: User) => ({
    //                 id: u.id,
    //                 username: u.username,
    //                 totalMinutes: minsByUser[u.id] || 0,
    //             }));
    //             setWorklogs(data);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             message.error("Failed to load worklog data");
    //         })
    //         .finally(() => setLoading(false));
    // }, [projectId, reloadKey]);

    useEffect(() => {
        setLoading(true);
        fetchProjectWorklogs(projectId)
            .then((data) => {
                setWorklogs(data);
            })
            .catch((err) => {
                console.error(err);
                message.error("Failed to load worklog summary");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [projectId, reloadKey]);


    if (loading) return <Spin style={{margin: "auto"}}/>;

    return (
        <Card title="Worklog Summary" style={{marginTop: 16}}>
            <List<UserWorklog>
                dataSource={worklogs}
                renderItem={item => {
                    const hours = Math.floor(item.totalMinutes / 60);
                    const minutes = item.totalMinutes % 60;
                    const color = AVATAR_COLORS[item.id % AVATAR_COLORS.length];
                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar style={{backgroundColor: color}}>
                                        {item.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={<Typography.Text strong>{item.username}</Typography.Text>}
                                description={`${hours}h ${minutes}m`}
                            />
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};

export default WorklogSection;
