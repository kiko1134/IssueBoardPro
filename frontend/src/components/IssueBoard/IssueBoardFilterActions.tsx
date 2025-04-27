import {Button, Input, Select} from "antd";
import React from "react";

const {Option} = Select;

interface IssueBoardFilterActionsProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    selectedType?: string;
    onTypeChange: (value?: string) => void;
    selectedPriority?: string;
    onPriorityChange: (value?: string) => void;
    onClear: () => void;
}

const IssueBoardFilterActions: React.FC<IssueBoardFilterActionsProps> = ({
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
                style={{width: 200, marginRight: '16px'}}
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
            />

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