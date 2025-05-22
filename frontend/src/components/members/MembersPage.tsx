import React, {useEffect, useState} from "react";
import {Avatar, Button, Input, List, message, Popconfirm, Space, Typography} from "antd";
import {
    addProjectMember,
    deleteProjectMember,
    fetchProjectDetails,
    fetchProjectMembers
} from "../../api/services/projectService";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import {User} from "../../api/services/userService";
import {jwtDecode} from "jwt-decode";

interface MembersPageProps {
    projectId: number;
}

interface DecodedToken {
    id: number;
    username: string;
    email: string;
}

const MembersPage: React.FC<MembersPageProps> = ({projectId}) => {
    const [members, setMembers] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);

    const [currentUserId] = useState<number>(() => {
        const token = localStorage.getItem('token');
        if (!token) return 0;
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return decoded.id;
        } catch {
            console.warn('Invalid token');
            return 0;
        }
    });

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setMembers)
            .catch(() => message.error("Failed to load members"));

        fetchProjectDetails(projectId)
            .then((proj) => {
                setIsAdmin(proj.adminId === currentUserId);
            })
            .catch(() => message.error('Failed to load project info'));
    }, [projectId,currentUserId]);

    const handleAdd = () => {
        addProjectMember(projectId, {email: newMemberEmail})
            .then((member) => {
                setMembers([...members, member]);
                setNewMemberEmail("");
                message.success("Member added");
            })
            .catch(() => message.error("Failed to add member"));
    };

    const handleRemove = (userId: number) => {
        deleteProjectMember(projectId, userId)
            .then(() => {
                setMembers((prev) => prev.filter((m) => m.id !== userId));
                message.success('Member removed');
            })
            .catch(() => message.error('Failed to remove member'));
    };


    return (
        <div style={{padding: 16}}>
            <Typography.Title level={4}>Project Members</Typography.Title>

            <List<User>
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(user) => {
                    const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
                    return (
                        <List.Item
                            actions={
                                isAdmin && user.id !== currentUserId
                                    ? [
                                        <Popconfirm
                                            title="Delete this user?"
                                            onConfirm={(e) => {
                                                handleRemove(user.id);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                            onCancel={(e) => {
                                                e?.stopPropagation();
                                            }}
                                        >
                                            <Button
                                                key="remove"
                                                type="link"
                                                danger
                                                // onClick={() => handleRemove(user.id)}
                                            >
                                                Remove
                                            </Button>
                                        </Popconfirm>,
                                    ]
                                    : []
                            }>
                            <List.Item.Meta
                                avatar={
                                    <Avatar style={{backgroundColor: color, verticalAlign: 'middle'}}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={<Typography.Text strong>{user.username}</Typography.Text>}
                                description={<Typography.Text type="secondary">{user.email}</Typography.Text>}
                            />
                        </List.Item>
                    );
                }}
            />
            {isAdmin && (
                <Space style={{marginTop: 24}}>
                    <Input
                        placeholder="User email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        style={{width: 240}}
                    />
                    <Button type="primary" onClick={handleAdd} disabled={!newMemberEmail.trim()}>
                        Add Member
                    </Button>
                </Space>
            )}
        </div>
    );
};

export default MembersPage;