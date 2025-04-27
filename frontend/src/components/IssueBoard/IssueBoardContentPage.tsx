import React, {useEffect, useState} from 'react';
import {closestCenter, DndContext, DragEndEvent,} from '@dnd-kit/core';
import {arrayMove, horizontalListSortingStrategy, SortableContext,} from '@dnd-kit/sortable';
import {Button, Card, Input, message} from 'antd';
import ColumnContainer from "./Column/ColumnContainer";
import TicketModal from "../Ticket/TicketModal";
import {Column as ColumnModel, createColumn, fetchColumns} from "../../api/columnService";
import {createTask, fetchTasks, Task as TaskModel, updateTask} from "../../api/taskService";

interface IssueBoardContentPageProps {
    projectId: number;
}


const IssueBoardContentPage: React.FC<IssueBoardContentPageProps> = ({projectId}) => {
    // State for columns and tasks.
    const [columns, setColumns] = useState<ColumnModel[]>([]);
    const [tasks, setTasks] = useState<TaskModel[]>([]);

    // State for adding a new column.
    const [addingColumn, setAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    // State for adding a new task.
    const [addingTaskColumn, setAddingTaskColumn] = useState<number | null>(null);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);

    // Load columns & tasks on mount or project change
    useEffect(() => {
        (async () => {
            try {
                setColumns(await fetchColumns(projectId));
            } catch {
                message.error('Failed to load columns');
            }
            try {
                setTasks(await fetchTasks(projectId));
            } catch {
                message.error('Failed to load tasks');
            }
        })();
    }, [projectId]);


    // Unified drag end handler to update either columns or tasks.
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;
        const activeType = active.data.current?.type;
        if (activeType === 'column') {
            // Reorder columns.
            if (active.id !== over.id) {
                setColumns((prev) => {
                    const oldIndex = prev.findIndex((col) => col.id === active.id);
                    const newIndex = prev.findIndex((col) => col.id === over.id);
                    return arrayMove(prev, oldIndex, newIndex);
                });
            }
        } else if (activeType === 'task') {
            // For tasks, determine source and destination columns.
            const sourceColumn = active.data.current?.containerId;
            // The over target can be a task or a column.
            const overType = over.data.current?.type;
            let destinationColumn = overType === 'task' ?
                over.data.current?.containerId : Number(over.id);
            if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === active.id ? {...task, columnId: destinationColumn!} : task
                    )
                );

                updateTask(Number(active.id), {columnId: destinationColumn})
                    .then(() => {
                        message.success('Task moved successfully');
                    })
                    .catch(() => {
                        message.error('Failed to move task');
                        fetchTasks(projectId).then(setTasks);
                    });
            }
        }
    };

    const handleAddTask = async (columnId: number) => {
        if (!newTaskName.trim()) return;
        try {
            const task = await createTask({
                title: newTaskName.trim(),
                description: newTaskDesc.trim(),
                projectId,
                statusId: 1,
                columnId,
                priority: 'Medium',
                type: 'Task',
                workLog: 0,
            });
            setTasks(prev => [...prev, task]);
            setNewTaskName('');
            setNewTaskDesc('');
            setAddingTaskColumn(null);
        } catch {
            message.error('Failed to create task');
        }
    };

    const handleAddColumn = async () => {
        if (!newColumnTitle.trim()) return;
        try {
            const col = await createColumn({name: newColumnTitle.trim(), projectId});
            setColumns(prev => [...prev, col]);
            setNewColumnTitle('');
            setAddingColumn(false);
        } catch {
            message.error('Failed to create column');
        }
    };

    const handleTaskClick = (task: TaskModel) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    }


    const handleSave = (updatedTask: TaskModel) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        closeModal();
    };


    return (
        <>
            <div style={{height: 'calc(100% - 50px)', overflowX: 'auto', display: 'flex'}}>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    {/* Wrap columns in a SortableContext (for horizontal column reordering) */}
                    <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
                        <div style={{display: 'flex'}}>
                            {columns.map((column) => {
                                return (
                                    <ColumnContainer
                                        key={column.id}
                                        // column={column}
                                        column={column}
                                        // tasks={tasksInColumn}
                                        tasks = {tasks.filter(t => t.columnId === column.id)}
                                        // onAddTask={handleAddTask}
                                        onAddTask={() => handleAddTask(column.id)}
                                        onTaskClick={handleTaskClick}
                                        addingTaskColumn={addingTaskColumn}
                                        setAddingTaskColumn={setAddingTaskColumn}
                                        newTaskName={newTaskName}
                                        setNewTaskName={setNewTaskName}
                                        newTaskDesc={newTaskDesc}
                                        setNewTaskDesc={setNewTaskDesc}
                                    />
                                );
                            })}
                            <div style={{margin: 8}}>
                                {addingColumn ? (
                                    <Card style={{width: 300, padding: 8}}>
                                        <Input
                                            placeholder="Enter column name..."
                                            value={newColumnTitle}
                                            onChange={(e) => setNewColumnTitle(e.target.value)}
                                        />
                                        <div style={{marginTop: 8, display: 'flex', gap: 8}}>
                                            <Button type="primary" onClick={handleAddColumn}>
                                                Add Column
                                            </Button>
                                            <Button onClick={() => setAddingColumn(false)}>Cancel</Button>
                                        </div>
                                    </Card>
                                ) : (
                                    <Button
                                        type="dashed"
                                        style={{width: 300, height: '100%'}}
                                        onClick={() => setAddingColumn(true)}
                                    >
                                        + Add another column
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <TicketModal
                open={!!selectedTask}
                issue={selectedTask}
                onClose={closeModal}
                onSave={handleSave}
            />
        </>
    );
};

export default IssueBoardContentPage;
