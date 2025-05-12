import {Avatar, Button, Input, Select, Tooltip} from "antd";
import React from "react";
import {User} from "../../api/services/userService";

const {Option} = Select;

interface IssueBoardFilterActionsProps {
    users: User[];
    selectedUsers: number[],
    onUserChange: (value: number[]) => void;
    searchText: string;
    onSearchChange: (value: string) => void;
    selectedType?: string;
    onTypeChange: (value?: string) => void;
    selectedPriority?: string;
    onPriorityChange: (value?: string) => void;
    onClear: () => void;
}

const AVATAR_COLORS = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#d4380d",
    "#13c2c2",
    "#1890ff",
    "#2f54eb",
    "#eb2f96",
    "#52c41a",
];

const IssueBoardFilterActions: React.FC<IssueBoardFilterActionsProps> = ({
                                                                             users,
                                                                             selectedUsers,
                                                                             onUserChange,
                                                                             searchText,
                                                                             onSearchChange,
                                                                             selectedType,
                                                                             onTypeChange,
                                                                             selectedPriority,
                                                                             onPriorityChange,
                                                                             onClear
                                                                         }) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            padding: 8,
            alignItems: "center",
            height: "50px"
        }}>
            {/* Filters: Search, Type, Priority */}
            <Input
                placeholder="Search"
                style={{
                    width: 200,
                    // marginRight: '16px'
                }}
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
            />

            <div style={{display: "flex", alignItems: "center", gap: 4}}>
                {users.map((user) => {
                    const selected = selectedUsers.includes(user.id);
                    const bgColor = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
                    return (
                        <Tooltip key={user.id} title={user.username}>
                            <Avatar
                                src={`https://api.adorable.io/avatars/40/${user.username}.png`}
                                style={{
                                    backgroundColor: bgColor,
                                    verticalAlign: "middle",
                                    cursor: "pointer",
                                    // border: selected ? "2px solid #1890ff" : undefined
                                    border: selected ? "2px solid black" : undefined
                                }}
                                onClick={() => {
                                    if (selectedUsers.includes(user.id)) {
                                        onUserChange(selectedUsers.filter((id) => id !== user.id));
                                    } else {
                                        onUserChange([...selectedUsers, user.id]);
                                    }
                                }}
                            >
                                {user.username[0].toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    )
                })}
            </div>

            <Select
                placeholder="Type"
                style={{width: 120, marginRight: '16px'}}
                value={selectedType}
                onChange={(value) => onTypeChange(value)}
                allowClear
            >
                <Option value="Bug">Bug</Option>
                <Option value="Feature">Feature</Option>
                <Option value="Task">Task</Option>
            </Select>

            <Select
                placeholder="Priority"
                style={{width: 120, marginRight: '16px'}}
                value={selectedPriority}
                onChange={(value) => onPriorityChange(value)}
                allowClear
            >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
            </Select>

            <Button onClick={onClear} style={{marginRight: 'auto'}}>
                Clear Filters
            </Button>
        </div>
    )
};

export default IssueBoardFilterActions;