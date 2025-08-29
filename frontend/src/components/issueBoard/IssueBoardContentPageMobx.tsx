import React, { useEffect, useState } from "react";
import {
    DndContext, DragEndEvent, DragOverlay, DragStartEvent,
    KeyboardSensor, PointerSensor, pointerWithin, useSensor, useSensors
} from "@dnd-kit/core";
import {
    arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { Button, Card, Input, message, Spin } from "antd";
import ColumnContainer from "./Column/ColumnContainer";
import TicketModal from "../ticket/TicketModal";

import { observer } from "mobx-react-lite";
import { useColumns, useTasks, useUI } from "../../stores/rootStore";
import type { Task as TaskModel } from "../../api/services/issueService";

interface Props { projectId: number; }

const IssueBoardContentPageMobx: React.FC<Props> = observer(({ projectId }) => {
    const ui = useUI();
    const columns = useColumns();
    const tasks = useTasks();

    const [addingColumn, setAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const [addingTaskColumn, setAddingTaskColumn] = useState<number | null>(null);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
    const [activeTask, setActiveTask] = useState<TaskModel | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // зареждане на колони (on project change)
    useEffect(() => { columns.load(projectId).catch(() => message.error("Failed to load columns")); }, [projectId,columns]);

    // зареждане на задачи при промяна на project/filters
    useEffect(() => {
        tasks.load(projectId).catch(() => message.error("Failed to load tasks"));
    }, [projectId, ui.searchText, ui.typeFilter, ui.priorityFilter, ui.userFilters,tasks]);

    const loading = columns.loading || tasks.loading;

    const handleDragStart = (e: DragStartEvent) => {
        if (e.active.data.current?.type === "task") {
            const id = Number((e.active.id as string).replace("task-", ""));
            const t = tasks.items.find(x => x.id === id) || null;
            setActiveTask(t);
        }
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = e;
        if (!over) return;

        const type = active.data.current?.type;
        const activeId = String(active.id);
        const overId = String(over.id);

        // Ред на колони
        if (type === "column" && activeId !== overId) {
            const prev = columns.items;
            const oldIdx = prev.findIndex(c => `column-${c.id}` === activeId);
            const newIdx = prev.findIndex(c => `column-${c.id}` === overId);
            const next = arrayMove(prev, oldIdx, newIdx);
            columns.reorder(next).catch(() => {
                message.error("Failed saving column order");
                columns.load(projectId);
            });
            return;
        }

        // Преместване на task
        if (type === "task") {
            const taskId = Number(activeId.replace("task-", ""));
            let destCol: number | undefined;
            if (over.data.current?.type === "task") {
                destCol = over.data.current.containerId;
            } else if (overId.startsWith("column-")) {
                destCol = Number(overId.replace("column-", ""));
            }
            const srcCol = active.data.current?.containerId;
            if (srcCol && destCol && srcCol !== destCol) {
                tasks.moveTask(taskId, destCol).then(() => {
                    message.success("Task moved");
                }).catch(() => {
                    message.error("Move failed");
                    tasks.load(projectId);
                });
            }
        }
    };

    const handleAddTask = async (columnId: number) => {
        if (!newTaskName.trim()) return;
        try {
            await tasks.create({
                title: newTaskName.trim(),
                description: newTaskDesc.trim(),
                projectId,
                statusId: 1,
                columnId,
                priority: "Medium",
                type: "Task",
                workLog: 0,
                assignedTo: undefined,
                assignedBy: undefined,
            } as any);
            setNewTaskName("");
            setNewTaskDesc("");
            setAddingTaskColumn(null);
        } catch {
            message.error("Failed to create task");
        }
    };

    const handleAddColumn = async () => {
        if (!newColumnTitle.trim()) return;
        try {
            await columns.create(newColumnTitle.trim(), projectId);
            setNewColumnTitle("");
            setAddingColumn(false);
        } catch {
            message.error("Failed to create column");
        }
    };

    const handleTaskClick = (task: TaskModel) => setSelectedTask(task);
    const closeModal = () => setSelectedTask(null);

    const handleSave = (updated: TaskModel) => {
        tasks.replace(updated);
        closeModal();
    };

    const handleRenameColumn = async (columnId: number, newName: string) => {
        try {
            await columns.rename(columnId, newName);
            message.success("Column renamed successfully");
        } catch {
            message.error("Failed to rename column");
        }
    };

    const handleDeleteColumn = async (id: number) => {
        try {
            await columns.remove(id);
            message.success("Column deleted successfully");
        } catch {
            message.error("Failed to delete column");
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await tasks.remove(taskId);
            message.success("Task deleted successfully");
        } catch {
            message.error("Failed to delete task");
        }
    };

    return (
        <>
            <div style={{ height: "calc(100% - 50px)", overflowX: "auto", display: "flex" }}>
                {loading && (
                    <div style={{
                        position: "absolute", inset: 0, display: "flex",
                        alignItems: "center", justifyContent: "center", zIndex: 10
                    }}>
                        <Spin size="large" />
                    </div>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveTask(null)}
                >
                    <SortableContext
                        items={columns.items.map((c) => `column-${c.id}`)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div style={{ display: "flex", overflowX: "auto", flexWrap: "nowrap" }}>
                            {columns.items.map((column) => (
                                <ColumnContainer
                                    key={column.id}
                                    id={`column-${column.id}`}
                                    column={column}
                                    tasks={(tasks.tasksByColumn[column.id] ?? [])}
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
                            ))}

                            <div style={{ margin: 8 }}>
                                {addingColumn ? (
                                    <Card style={{ width: 300, padding: 8 }}>
                                        <Input
                                            placeholder="Enter column name..."
                                            value={newColumnTitle}
                                            onChange={(e) => setNewColumnTitle(e.target.value)}
                                        />
                                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                            <Button type="primary" onClick={handleAddColumn}>Add Column</Button>
                                            <Button onClick={() => setAddingColumn(false)}>Cancel</Button>
                                        </div>
                                    </Card>
                                ) : (
                                    <Button
                                        type="dashed"
                                        style={{ width: 300, height: 60 }}
                                        onClick={() => setAddingColumn(true)}
                                    >
                                        + Add column
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeTask && (
                            <div style={{
                                padding: 8, background: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderRadius: 4
                            }}>
                                {activeTask.title}
                            </div>
                        )}
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
});

export default IssueBoardContentPageMobx;
