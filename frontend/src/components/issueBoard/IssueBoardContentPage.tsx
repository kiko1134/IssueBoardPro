import React, { useEffect, useRef, useState } from "react";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Button, Card, Input, message, Spin } from "antd";
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
import {
  createTask,
  deleteTask,
  fetchTasks,
  Task as TaskModel,
  updateTask,
} from "../../api/services/issueService";

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
  userFilters,
}) => {

  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [addingTaskColumn, setAddingTaskColumn] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
  const [activeTask, setActiveTask] = useState<TaskModel | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  
  useEffect(() => {
    isMounted.current = false;
    setLoading(true);
    Promise.all([fetchColumns(projectId), fetchTasks(projectId)])
      .then(([cols, ts]) => {
        if (!isMounted.current) {
          setColumns(cols);
          setTasks(ts);
        }
      })
      .catch((err) => {
        if (!isMounted.current) {
          console.error(err);
          message.error("Failed to load board data");
        }
      })
      .finally(() => {
        if (!isMounted.current) {
          setLoading(false);
        }
      });

    return () => {
      isMounted.current = true;
    };
  }, [projectId]);

  const filteredTasks = tasks.filter((task) => {
    if (searchText) {
      const txt = searchText.toLowerCase();
      if (
        !task.title.toLowerCase().includes(txt) &&
        !(task.description || "").toLowerCase().includes(txt)
      )
        return false;
    }
    if (typeFilter && task.type !== typeFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (userFilters.length && !userFilters.includes(task.assignedTo)) return false;
    return true;
  });


  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "task") {
      const id = Number((event.active.id as string).replace("task-", ""));
      setActiveTask(tasks.find((t) => t.id === id) || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const type = active.data.current?.type;
    const activeId = active.id as string;
    const overId = over.id as string;

    if (type === "column" && activeId !== overId) {
      setColumns((prev) => {
        const oldIdx = prev.findIndex((c) => `column-${c.id}` === activeId);
        const newIdx = prev.findIndex((c) => `column-${c.id}` === overId);
        const next = arrayMove(prev, oldIdx, newIdx);
        reorderColumns(next.map((c, i) => ({ id: c.id, position: i }))).catch(() => {
          message.error("Failed saving column order");
          fetchColumns(projectId).then(setColumns);
        });
        return next;
      });
    } else if (type === "task") {
      const taskId = Number(activeId.replace("task-", ""));
      let destCol: number | undefined;
      if (over.data.current?.type === "task") {
        destCol = over.data.current.containerId;
      } else if (overId.startsWith("column-")) {
        destCol = Number(overId.replace("column-", ""));
      }
      const srcCol = active.data.current?.containerId;
      if (srcCol && destCol && srcCol !== destCol) {
        setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, columnId: destCol! } : t)));
        updateTask(taskId, { columnId: destCol })
          .then(() => message.success("Task moved"))
          .catch(() => {
            message.error("Move failed");
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
        priority: "Medium",
        type: "Task",
        workLog: 0,
      });
      setTasks((prev) => [...prev, task]);
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
      const col = await createColumn({ name: newColumnTitle.trim(), projectId });
      setColumns((prev) => [...prev, col]);
      setNewColumnTitle("");
      setAddingColumn(false);
    } catch {
      message.error("Failed to create column");
    }
  };

  
  const handleTaskClick = (task: TaskModel) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);


  const handleSave = (updated: TaskModel) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    closeModal();
  };


  const handleRenameColumn = async (columnId: number, newName: string) => {
    try {
      const updated = await updateColumn(columnId, { name: newName });
      setColumns((cols) => cols.map((c) => (c.id === updated.id ? updated : c)));
      message.success("Column renamed successfully");
    } catch {
      message.error("Failed to rename column");
    }
  };

  const handleDeleteColumn = async (id: number) => {
    try {
      await deleteColumn(id);
      setColumns((cols) => cols.filter((c) => c.id !== id));
      message.success("Column deleted successfully");
    } catch {
      message.error("Failed to delete column");
    }
  };

  
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((ts) => ts.filter((t) => t.id !== taskId));
      message.success("Task deleted successfully");
    } catch {
      message.error("Failed to delete task");
    }
  };

  return (
    <>
      <div style={{ height: "calc(100% - 50px)", overflowX: "auto", display: "flex" }}>
        {loading ? (
          <Spin style={{ margin: "auto" }} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveTask(null)}
          >
            <SortableContext
              items={columns.map((c) => `column-${c.id}`)}
              strategy={horizontalListSortingStrategy}
            >
              <div style={{ display: "flex", overflowX: "auto", flexWrap: "nowrap" }}>
                {columns.map((column) => (
                  <ColumnContainer
                    key={column.id}
                    id={`column-${column.id}`}
                    column={column}
                    tasks={filteredTasks.filter((t) => t.columnId === column.id)}
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
                        <Button type="primary" onClick={handleAddColumn}>
                          Add Column
                        </Button>
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
                <div
                  style={{
                    padding: 8,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderRadius: 4,
                  }}
                >
                  {activeTask.title}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
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