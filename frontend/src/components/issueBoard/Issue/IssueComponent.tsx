import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card, Popconfirm, Space, Tooltip, Typography} from "antd";
import {DeleteOutlined, MenuOutlined} from "@ant-design/icons"
import {Task} from "../../../api/services/issueService";


interface IssueComponentProps {
    issue: Task;
    onClick: () => void;
    onDelete: () => void;

}

const IssueComponent: React.FC<IssueComponentProps> = ({issue, onClick, onDelete}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
        id: `task-${issue.id}`,
        data: {type: 'task', containerId: issue.columnId},
    });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '4px',
        margin: '4px 0',
        borderRadius: '4px',
        cursor: 'grab',
    };
    return (
        <div ref={setNodeRef} style={style}>
            <Card
                size="small"
                hoverable
                onClick={onClick}
                style={{padding: 6, cursor: "pointer", backgroundColor: '#e6f7ff'}}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                    }}
                >
                    <Typography.Text strong style={{margin: 0}}>
                        {issue.title}
                    </Typography.Text>

                    <Space size="small">
                        <Popconfirm
                            title="Delete this task?"
                            onConfirm={(e) => {
                                e?.stopPropagation();
                                onDelete();
                            }}
                            okText="Yes"
                            cancelText="No"
                            onCancel={(e) => {
                                e?.stopPropagation();
                            }}
                        >
                            <span onClick={e => {
                                e.stopPropagation();
                            }}>
                            <DeleteOutlined
                                style={{color: '#ff4d4f', fontSize: 16, cursor: 'pointer'}}
                            />
                                </span>
                        </Popconfirm>
                        <Tooltip title="Drag to reorder">
                            <MenuOutlined
                                {...attributes}
                                {...listeners}
                                style={{cursor: 'grab', fontSize: 16, color: '#999'}}
                                onClick={e => e.stopPropagation()}
                            />
                        </Tooltip>
                    </Space>
                </div>

                {issue.description && (
                    <Typography.Paragraph style={{margin: 0, whiteSpace: 'pre-wrap'}}>
                        {issue.description}
                    </Typography.Paragraph>
                )}
            </Card>
        </div>
    );
};

export default IssueComponent;