import {Button, Col, Input, Row, Select} from "antd";
import React, {useState} from "react";
import TicketModal, { Issue } from "../../Ticket/TicketModal";

const {Option} = Select;

const IssueModalComponent: React.FC = () => {

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    const [selectedType, setSelectedType] = useState<string>();
    const [selectedPriority, setSelectedPriority] = useState<string>();

    const clearFilters = () => {
        setSelectedType(undefined);
        setSelectedPriority(undefined);
    };

    const openModal = () => {
        setSelectedTicket({
            id: Date.now(),
            title: "",
            description: "",
            type: "",
            priority: ""
        });
        setIsModalVisible(true);
    };
    
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedTicket(null);
    };

    const saveModal = (updatedIssue: Issue) => {
        console.log("Updated issue:", updatedIssue);
        closeModal();
    };

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 6,
                padding: 8,
                alignItems: "center",
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
            <div style={{padding: 8}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: '#fff',
                                minHeight: '200px',
                                padding: '16px',
                                cursor: 'pointer'
                            }}
                            onClick={openModal}
                        >
                            Column 1
                        </div>
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: '#fff',
                                minHeight: '200px',
                                padding: '16px'
                            }}
                        >
                            Column 2
                        </div>
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: '#fff',
                                minHeight: '200px',
                                padding: '16px'
                            }}
                        >
                            Column 3
                        </div>
                    </Col>
                </Row>
            </div>
            <TicketModal
            open={isModalVisible}
            onClose={closeModal}
            issue={selectedTicket}
            onSave={saveModal}
            />
        </>
    )
};

export default IssueModalComponent;

