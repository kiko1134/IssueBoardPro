import React, {useEffect, useState} from "react";
import {Avatar, Button, Input, List, message} from "antd";
import {addProjectMember, fetchProjectMembers, fetchUsers} from "../../api/services/projectService";

interface MembersPageProps {
    projectId: number;
}

const MembersPage: React.FC<MembersPageProps> = ({projectId}) => {
    const [members, setMembers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");

    useEffect(() => {
        fetchProjectMembers(projectId)
            .then(setMembers)
            .catch(() => message.error("Failed to load members"));
        fetchUsers()
            .then(setAllUsers)
            .catch(() => message.error("Failed to load users"));
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
        <div>
            <h2>Project Members</h2>
            <List
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(user) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{user.username.charAt(0)}</Avatar>}
                            title={user.username}
                            description={user.email}
                        />
                    </List.Item>
                )}
            />

            <div style={{marginTop: 16, display: "flex", gap: 8}}>
                <Input
                    placeholder="User email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    style={{width: 200}}
                />
                <Button type="primary" onClick={handleAdd} disabled={!newMemberEmail}>
                    Add Member
                </Button>
            </div>
        </div>
    );
};

export default MembersPage;