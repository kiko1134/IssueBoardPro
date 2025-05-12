import React, {useEffect, useState} from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {Button, Card, Input, message} from 'antd';
import ColumnContainer from "./Column/ColumnContainer";
import TicketModal from "../ticket/TicketModal";
import {
    Column as ColumnModel,
    createColumn,
    deleteColumn,
    fetchColumns,
    reorderColumns,
    updateColumn,
} from "../../api/services/columnService";
import {createTask, deleteTask, fetchTasks, Task as TaskModel, updateTask} from "../../api/services/issueService";

interface IssueBoardContentPageProps {
    projectId: number;
    searchText: string;
    typeFilter?: string;
    priorityFilter?: string;
    userFilters: number[];
}


const IssueBoardContentPage: React.FC<IssueBoardContentPageProps> = ({
                                                                         projectId,
                                                                         searchText,
                                                                         typeFilter,
                                                                         priorityFilter,
                                                                         userFilters
                                                                     }) => {
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

    const [activeTask, setActiveTask] = useState<TaskModel | null>(null);
    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

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

    const filteredTasks = tasks.filter(task => {
        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase();
            if (
                !task.title.toLowerCase().includes(lowerCaseSearchText) &&
                !(task.description || '').toLowerCase().includes(lowerCaseSearchText)
            )
                return false;
        }
        if (typeFilter && task.type !== typeFilter) return false;
        if (priorityFilter && task.priority !== priorityFilter) return false;
        if (userFilters.length > 0 && !userFilters.includes(task.assignedTo)) return false;
        return true;
    });

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        if (active.data.current?.type === 'task') {
            const taskId = Number((active.id as string).replace(/^task-/, ''));
            const task = tasks.find(t => t.id === taskId);
            setActiveTask(task || null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        // clear any task overlay
        setActiveTask(null);

        if (!over) return;

        // grab our metadata
        const type = active.data.current?.type;
        const activeId = active.id as string;  // e.g. "column-3" or "task-17"
        const overId = over.id as string;

        if (type === 'column' && activeId !== overId) {
            // Reorder columns array
            setColumns(prevCols => {
                const oldIndex = prevCols.findIndex(c => `column-${c.id}` === activeId);
                const newIndex = prevCols.findIndex(c => `column-${c.id}` === overId);
                const next = arrayMove(prevCols, oldIndex, newIndex);

                // Bulk‐persist the new positions:
                reorderColumns(
                    next.map((col, idx) => ({id: col.id, position: idx}))
                ).catch(() => {
                    message.error('Failed saving column order');
                    // Optionally reload columns here:
                    fetchColumns(projectId).then(setColumns);
                });

                return next;
            });

        } else if (type === 'task') {
            // parse the numeric task ID
            const taskId = Number(activeId.replace(/^task-/, ''));
            // determine target column
            let destCol: number | undefined;

            if (over.data.current?.type === 'task') {
                // dropped onto another task → use its containerId
                destCol = over.data.current.containerId;
            } else if (overId.startsWith('column-')) {
                // dropped onto a column wrapper
                destCol = Number(overId.replace(/^column-/, ''));
            }

            const srcCol = active.data.current?.containerId;
            if (srcCol && destCol && srcCol !== destCol) {
                // update local state
                setTasks(ts =>
                    ts.map(t => t.id === taskId ? {...t, columnId: destCol!} : t)
                );
                // persist
                updateTask(taskId, {columnId: destCol})
                    .then(() => message.success('Task moved'))
                    .catch(() => {
                        message.error('Move failed');
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

    const handleDragCancel = () => setActiveTask(null);


    const handleSave = (updatedTask: TaskModel) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        closeModal();
    };

    const handleRenameColumn = async (columnId: number, newName: string) => {
        try {
            const updatedColumn = await updateColumn(columnId, {name: newName});
            setColumns((columns) =>
                columns.map((column) => (column.id === updatedColumn.id ? updatedColumn : column))
            );
            message.success('Column renamed successfully');
        } catch (error) {
            message.error('Failed to rename column');
        }
    };

    const handleDeleteColumn = async (id: number) => {
        try {
            await deleteColumn(id);
            setColumns((columns) => columns.filter((column) => column.id !== id));
            message.success('Column deleted successfully');
        } catch (error) {
            message.error('Failed to delete column');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
            message.success('Task deleted successfully');
        } catch (error) {
            message.error('Failed to delete task');
        }
    }


    return (
        <>
            <div style={{height: 'calc(100% - 50px)', overflowX: 'auto', display: 'flex'}}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext items={columns.map((col) => `column-${col.id}`)}
                                     strategy={horizontalListSortingStrategy}>
                        <div style={{display: 'flex', overflowX: "auto", flexWrap: 'nowrap'}}>
                            {columns.map((column) => {
                                return (
                                    <ColumnContainer
                                        key={column.id}
                                        column={column}
                                        id={`column-${column.id}`}
                                        tasks={filteredTasks.filter(task => task.columnId === column.id)}
                                        onAddTask={() => handleAddTask(column.id)}
                                        onTaskClick={handleTaskClick}
                                        addingTaskColumn={addingTaskColumn}
                                        setAddingTaskColumn={setAddingTaskColumn}
                                        newTaskName={newTaskName}
                                        setNewTaskName={setNewTaskName}
                                        newTaskDesc={newTaskDesc}
                                        setNewTaskDesc={setNewTaskDesc}
                                        onRenameColumn={handleRenameColumn}
                                        onDeleteColumn={handleDeleteColumn}
                                        onDeleteTask={handleDeleteTask}
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
                                        style={{width: 300, height: 60}}
                                        onClick={() => setAddingColumn(true)}
                                    >
                                        + Add another column
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SortableContext>
                    <DragOverlay>
                        {activeTask ? (
                            <div
                                style={{
                                    padding: 8,
                                    background: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    borderRadius: 4,
                                }}
                            >
                                {activeTask.title}
                            </div>
                        ) : null}
                    </DragOverlay>
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
