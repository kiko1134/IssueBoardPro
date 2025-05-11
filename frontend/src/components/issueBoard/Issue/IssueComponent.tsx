import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card} from "antd";
import {MenuOutlined} from "@ant-design/icons"
import {Task} from "../../../api/services/issueService";


interface IssueComponentProps {
    issue: Task;
    onClick: () => void;

}

const IssueComponent: React.FC<IssueComponentProps> = ({issue, onClick}) => {
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
                title={<strong>{issue.title}</strong>}
                extra={
                    <MenuOutlined {...attributes} {...listeners} style={{cursor: "grab", padding: "4px"}}
                                  onClick={(e) => e.stopPropagation()}/>
                }
            >
                <div style={{fontSize: 12, color: "#666", marginTop: 4}}>
                    {issue.description}
                </div>
            </Card>
        </div>
    );
};

export default IssueComponent;