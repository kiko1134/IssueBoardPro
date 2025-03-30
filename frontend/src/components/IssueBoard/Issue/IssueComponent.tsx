import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface Issue {
    id: string;
    name: string;
    description: string;
    columnId: string;
}

interface IssueComponentProps {
    issue: Issue;
}

const IssueComponent: React.FC<IssueComponentProps> = ({ issue }) => {
    // Pass containerId as part of the data so we know which column this task is in.
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
        id: issue.id,
        data: {type: 'task', containerId: issue.columnId},
    });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px',
        margin: '4px 0',
        backgroundColor: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '4px',
        cursor: 'grab',
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <strong>{issue.name}</strong>
            <p style={{margin: 0, fontSize: '12px'}}>{issue.description}</p>
        </div>
    );
};

export default IssueComponent;