import React, {useState} from "react";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDroppable} from "@dnd-kit/core";
import IssueComponent from "../Issue/IssueComponent";
import {Button, Card, Input, message, Popconfirm, Space, Tooltip, Typography} from "antd";
import {DeleteOutlined, EditOutlined, MenuOutlined} from "@ant-design/icons";
import {Column} from "../../../api/services/columnService";
import {Task} from "../../../api/services/issueService";


interface ColumnContainerProps {
    column: Column;
    id: string;
    tasks: Task[];
    onAddTask: (columnId: number) => void;
    onTaskClick: (task: Task) => void;
    addingTaskColumn: number | null;
    setAddingTaskColumn: (columnId: number | null) => void;
    newTaskName: string;
    setNewTaskName: (value: string) => void;
    newTaskDesc: string;
    setNewTaskDesc: (value: string) => void;
    onRenameColumn: (columnId: number, newName: string) => void;
    onDeleteColumn: (columnId: number) => void;
    onDeleteTask: (taskId: number) => void;
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
                                                             onTaskClick,
                                                             onRenameColumn,
                                                             onDeleteColumn,
                                                             onDeleteTask,
                                                             id,
                                                         }) => {
    const {
        attributes,
        listeners,
        setNodeRef, transform,
        transition
    } = useSortable({
        id: id,
        data: {type: 'column'},
    });

    const isEmpty = tasks.length === 0;

    const columnStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: 300,
        flex: '0 0 auto',      // prevents shrinking or growing
        minHeight: 200,
        margin: 8,
        background: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: "4px",
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
    };

    const {setNodeRef: setDroppableRef} = useDroppable({id: column.id});
    // Merge the refs.
    const setCombinedRef = (node: HTMLElement | null) => {
        setNodeRef(node);
        setDroppableRef(node);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(column.name);

    const submitTitle = () => {
        const trimmed = titleValue.trim();
        if (!trimmed) {
            message.error("Name cannot be empty");
        } else if (trimmed !== column.name) {
            onRenameColumn(column.id, trimmed);
        }
        setIsEditing(false);
    };

    return (
        <div ref={setCombinedRef} style={columnStyle}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {isEditing ? (
                    <Input
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        onPressEnter={submitTitle}
                        onBlur={submitTitle}
                        autoFocus
                        style={{margin: 0}}
                    />
                ) : (
                    <Typography.Text
                        strong
                        style={{
                            margin: 0,
                            display: "inline-block",
                            fontSize: 16,
                        }}
                        onDoubleClick={() => {
                            setTitleValue(column.name);
                            setIsEditing(true);
                        }}
                    >
                        {column.name}
                    </Typography.Text>
                )}

                <Space size="small">
                    {!isEditing && (
                        <Tooltip title="Edit column name">
                            <EditOutlined
                                onClick={() => {
                                    setTitleValue(column.name);
                                    setIsEditing(true);
                                }}
                            />
                        </Tooltip>
                    )}
                    <Popconfirm
                        title="Delete this column?"
                        onConfirm={() => onDeleteColumn(column.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{color: "red"}}/>
                    </Popconfirm>

                    <Tooltip title="Drag to reorder">
                        <MenuOutlined
                            {...attributes}
                            {...listeners}
                            style={{cursor: "grab", fontSize: 18, color: "#999"}}
                        />
                    </Tooltip>
                </Space>
            </div>

            {/* Tasks in this column */}
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div style={{
                    flexGrow: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    marginTop: 8,
                }}>
                    {tasks.map((issue) => (
                        <IssueComponent key={issue.id} issue={issue} onClick={() => onTaskClick(issue)}
                                        onDelete={() => onDeleteTask(issue.id)}/>
                    ))}
                </div>
            </SortableContext>

            {/* "Add Task" section */}
            <div
                style={{
                    position: "sticky",
                    bottom: 0,
                    marginTop: 8,
                    background: "#fafafa",
                    paddingTop: 8,
                    zIndex: 1,
                }}
            >
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
                            <Button type="primary" onClick={() => onAddTask(column.id)}>
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
        </div>
    );
};

export default ColumnContainer;