import React, { useEffect, useState } from "react";
import { AutoComplete, Avatar, Button, List, message, Popconfirm, Space, Tooltip, Typography } from "antd";
import { addProjectMember, deleteProjectMember, fetchProjectDetails, fetchProjectMembers } from "../../api/services/projectService";
import { AVATAR_COLORS } from "../issueBoard/IssueBoardFilterActions";
import { fetchUsers, User } from "../../api/services/userService";
import { observer } from "mobx-react-lite";
import { useUser } from "../../stores/rootStore";

interface MembersPageProps { projectId: number; }

const MembersPage: React.FC<MembersPageProps> = observer(({ projectId }) => {
    const [members, setMembers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId, setAdminId] = useState<number | null>(null);

    const user = useUser();

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setMembers)
            .catch(() => message.error("Failed to load members"));

        fetchProjectDetails(projectId)
            .then((proj) => {
                setAdminId(proj.adminId);
                setIsAdmin(proj.adminId === user.user?.id);
            })
            .catch(() => message.error("Failed to load project info"));
    }, [projectId, user.user?.id]);

    useEffect(() => {
        fetchUsers()
            .then(setAllUsers)
            .catch(() => message.error("Failed to load users list"));
    }, []);

    const handleAdd = () => {
        addProjectMember(projectId, { email: newMemberEmail })
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
                message.success("Member removed");
            })
            .catch(() => message.error("Failed to remove member"));
    };

    const filteredOptions = allUsers
        .filter((u) => u.id !== adminId)
        .filter((u) => !members.some((m) => m.id === u.id))
        .filter((u) => u.email.toLowerCase().includes(newMemberEmail.toLowerCase()))
        .map((u) => ({
            value: u.email,
            label: (
                <Tooltip title={u.email} placement="right">
                    <Space>
                        <Avatar size="small" style={{ backgroundColor: AVATAR_COLORS[u.id % AVATAR_COLORS.length] }}>
                            {u.username[0].toUpperCase()}
                        </Avatar>
                        <Typography.Text ellipsis={{ tooltip: true }}>{u.username}</Typography.Text>
                    </Space>
                </Tooltip>
            ),
        }));

    return (
        <div style={{ padding: 16 }}>
            <Typography.Title level={4}>Project Members</Typography.Title>

            <List<User>
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(c_user: any) => {
                    const color = AVATAR_COLORS[c_user.id % AVATAR_COLORS.length];
                    return (
                        <List.Item
                            actions={
                                isAdmin && c_user.id !== user.user?.id
                                    ? [
                                        <Popconfirm
                                            title="Delete this user?"
                                            onConfirm={() => handleRemove(c_user.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button key="remove" type="link" danger>Remove</Button>
                                        </Popconfirm>,
                                    ]
                                    : []
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: color, verticalAlign: "middle" }}>{c_user.username.charAt(0).toUpperCase()}</Avatar>}
                                title={<Typography.Text strong>{c_user.username}</Typography.Text>}
                                description={<Typography.Text type="secondary">{c_user.email}</Typography.Text>}
                            />
                        </List.Item>
                    );
                }}
            />

            {isAdmin && (
                <Space style={{ marginTop: 24 }}>
                    <AutoComplete
                        style={{ width: 240 }}
                        options={filteredOptions}
                        value={newMemberEmail}
                        onSearch={setNewMemberEmail}
                        onSelect={(value) => setNewMemberEmail(value)}
                        placeholder="User email"
                        filterOption={false}
                    />
                    <Button type="primary" onClick={handleAdd} disabled={!newMemberEmail.trim()}>
                        Add Member
                    </Button>
                </Space>
            )}
        </div>
    );
});

export default MembersPage;
