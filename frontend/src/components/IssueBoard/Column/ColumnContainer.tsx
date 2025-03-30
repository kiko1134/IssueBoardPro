import React from "react";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDroppable} from "@dnd-kit/core";
import IssueComponent from "../Issue/IssueComponent";
import {Button, Card, Input} from "antd";
import {Column, Task} from "../IssueBoardContentPage";

interface ColumnContainerProps {
    column: Column;
    tasks: Task[];
    onAddTask: (columnId: string, name: string, description: string) => void;
    addingTaskColumn: string | null;
    setAddingTaskColumn: (columnId: string | null) => void;
    newTaskName: string;
    setNewTaskName: (value: string) => void;
    newTaskDesc: string;
    setNewTaskDesc: (value: string) => void;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
                                                             column,
                                                             tasks,
                                                             onAddTask,
                                                             addingTaskColumn,
                                                             setAddingTaskColumn,
                                                             newTaskName,
                                                             setNewTaskName,
                                                             newTaskDesc,
                                                             setNewTaskDesc,
                                                         }) => {
    // Make the column draggable (but we'll only attach the drag listeners to the header)
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
        id: column.id,
        data: {type: 'column'},
    });
    const columnStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: 300,
        margin: 8,
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: 4,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        overflowY:"auto"
    };

    // Also register this column as a droppable area for tasks.
    const {setNodeRef: setDroppableRef} = useDroppable({id: column.id});
    // Merge the refs.
    const setCombinedRef = (node: HTMLElement | null) => {
        setNodeRef(node);
        setDroppableRef(node);
    };

    return (
        <div ref={setCombinedRef} style={columnStyle}>
            {/* DRAG HANDLE: Only the header gets the drag listeners */}
            <div {...attributes} {...listeners} style={{cursor: 'grab'}}>
                <h3 style={{textAlign: 'center', margin: 0}}>{column.title}</h3>
            </div>

            {/* Tasks in this column */}
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div style={{minHeight: 50}}>
                    {tasks.map((issue) => (
                        <IssueComponent key={issue.id} issue={issue}/>
                    ))}
                </div>
            </SortableContext>

            {/* "Add Task" section */}
            {addingTaskColumn === column.id ? (
                <Card style={{padding: 8, marginTop: 8}}>
                    <Input
                        placeholder="Task name"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                    <Input
                        placeholder="Description"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        style={{marginTop: 4}}
                    />
                    <div style={{marginTop: 8, display: 'flex', gap: 8}}>
                        <Button type="primary" onClick={() => onAddTask(column.id, newTaskName, newTaskDesc)}>
                            Add Task
                        </Button>
                        <Button onClick={() => setAddingTaskColumn(null)}>Cancel</Button>
                    </div>
                </Card>
            ) : (
                <Button
                    type="dashed"
                    style={{width: '100%', marginTop: 8}}
                    onClick={() => setAddingTaskColumn(column.id)}
                >
                    + Add task
                </Button>
            )}
        </div>
    );
};

export default ColumnContainer;