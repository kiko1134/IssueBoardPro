import {Button, Input, Select} from "antd";
import React, {useState} from "react";

const {Option} = Select;

const IssueBoardFilterActions: React.FC = () => {

    const [selectedType, setSelectedType] = useState<string>();
    const [selectedPriority, setSelectedPriority] = useState<string>();

    const clearFilters = () => {
        setSelectedType(undefined);
        setSelectedPriority(undefined);
    };

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
            />

            <Select
                placeholder="Type"
                style={{width: 120, marginRight: '16px'}}
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
                allowClear
            >
                <Option value="bug">Bug</Option>
                <Option value="feature">Feature</Option>
                <Option value="task">Task</Option>
            </Select>

            <Select
                placeholder="Priority"
                style={{width: 120, marginRight: '16px'}}
                value={selectedPriority}
                onChange={(value) => setSelectedPriority(value)}
                allowClear
            >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
            </Select>

            <Button onClick={clearFilters} style={{marginRight: 'auto'}}>
                Clear Filters
            </Button>
        </div>
    )
};

export default IssueBoardFilterActions;