import React, {useState} from 'react';
import {closestCenter, DndContext, DragEndEvent,} from '@dnd-kit/core';
import {arrayMove, horizontalListSortingStrategy, SortableContext,} from '@dnd-kit/sortable';
import {Button, Card, Input} from 'antd';
import ColumnContainer from "./Column/ColumnContainer";

export interface Column {
    id: string;
    title: string;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    columnId: string;
}

const initialColumns: Column[] = [
    {id: 'column-1', title: 'To Do'},
    {id: 'column-2', title: 'In Progress'},
    {id: 'column-3', title: 'Done'},
];

const initialTasks: Task[] = [
    {id: 'task-1', name: 'Task One', description: 'Description One', columnId: 'column-1'},
    {id: 'task-2', name: 'Task Two', description: 'Description Two', columnId: 'column-1'},
    {id: 'task-3', name: 'Task Three', description: 'Description Three', columnId: 'column-2'},
];


const createUniqueId = (prefix: string) => {
    return prefix + '-' + Math.random().toString(36).substring(2, 9);
};


const IssueBoardContentPage: React.FC = () => {
    // State for columns and tasks.
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // State for adding a new column.
    const [addingColumn, setAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    // State for adding a new task.
    const [addingTaskColumn, setAddingTaskColumn] = useState<string | null>(null);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

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
            let destinationColumn: string | undefined;
            // The over target can be a task or a column.
            const overType = over.data.current?.type;
            if (overType === 'task') {
                destinationColumn = over.data.current?.containerId;
            } else {
                // If over is a column droppable, its id is the destination column.
                destinationColumn = over.id as string;
            }
            if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === active.id ? {...task, columnId: destinationColumn!} : task
                    )
                );
            }
            // (Optional: implement reordering tasks within the same column here.)
        }
    };

    const handleAddTask = (columnId: string, name: string, description: string) => {
        if (!name.trim()) return;
        const newTask: Task = {
            id: createUniqueId('task'),
            name: name.trim(),
            description: description.trim(),
            columnId,
        };
        setTasks((prev) => [...prev, newTask]);
        setNewTaskName('');
        setNewTaskDesc('');
        setAddingTaskColumn(null);
    };

    const handleAddColumn = () => {
        if (!newColumnTitle.trim()) return;
        const newColumn: Column = {
            id: createUniqueId('column'),
            title: newColumnTitle.trim(),
        };
        setColumns((prev) => [...prev, newColumn]);
        setNewColumnTitle('');
        setAddingColumn(false);
    };

    return (
        <div style={{height: 'calc(100% - 50px)', overflowX: 'auto', display: 'flex'}}>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {/* Wrap columns in a SortableContext (for horizontal column reordering) */}
                <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
                    <div style={{display: 'flex'}}>
                        {columns.map((column) => {
                            const tasksInColumn = tasks.filter((task) => task.columnId === column.id);
                            return (
                                <ColumnContainer
                                    key={column.id}
                                    column={column}
                                    tasks={tasksInColumn}
                                    onAddTask={handleAddTask}
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
    );
};

export default IssueBoardContentPage;
