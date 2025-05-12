import React, {useEffect, useState} from "react";
import {Avatar, Button, Input, List, message, Space, Typography} from "antd";
import {addProjectMember, fetchProjectMembers} from "../../api/services/projectService";
import {AVATAR_COLORS} from "../issueBoard/IssueBoardFilterActions";
import {User} from "../../api/services/userService";

interface MembersPageProps {
    projectId: number;
}

const MembersPage: React.FC<MembersPageProps> = ({projectId}) => {
    const [members, setMembers] = useState<any[]>([]);
    // const [allUsers, setAllUsers] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setMembers)
            .catch(() => message.error("Failed to load members"));
    }, [projectId]);

    const handleAdd = () => {
        addProjectMember(projectId, {email: newMemberEmail})
            .then((member) => {
                setMembers([...members, member]);
                setNewMemberEmail("");
                message.success("Member added");
            })
            .catch(() => message.error("Failed to add member"));
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
                        <List.Item>
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
        </div>
    );
};

export default MembersPage;