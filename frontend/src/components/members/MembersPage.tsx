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
import {UserContext} from "../context/UserContext";

interface MembersPageProps {
    projectId: number;
}


const MembersPage: React.FC<MembersPageProps> = ({projectId}) => {
    const [members, setMembers] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);

    const {user} = React.useContext(UserContext);

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setMembers)
            .catch(() => message.error("Failed to load members"));

        fetchProjectDetails(projectId)
            .then((proj) => {
                setIsAdmin(proj.adminId === user?.id);
            })
            .catch(() => message.error('Failed to load project info'));
    }, [projectId, user?.id]);

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
                renderItem={(c_user) => {
                    const color = AVATAR_COLORS[c_user.id % AVATAR_COLORS.length];
                    return (
                        <List.Item
                            actions={
                                isAdmin && c_user.id !== user?.id
                                    ? [
                                        <Popconfirm
                                            title="Delete this user?"
                                            onConfirm={(e) => {
                                                handleRemove(c_user.id);
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
                                        {c_user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                title={<Typography.Text strong>{c_user.username}</Typography.Text>}
                                description={<Typography.Text type="secondary">{c_user.email}</Typography.Text>}
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