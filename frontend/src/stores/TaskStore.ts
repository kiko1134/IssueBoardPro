import {computed, makeAutoObservable, runInAction} from "mobx";
import type {RootStore} from "./rootStore";
import {
    createTask as apiCreateTask,
    deleteTask as apiDeleteTask,
    fetchTasks as apiFetchTasks,
    fetchTaskWorklog, logWork,
    type Task,
    type TaskFilters,
    updateTask as apiUpdateTask,
} from "../api/services/issueService";

export class TaskStore {
    private root: RootStore;

    items: Task[] = [];
    loading = false;

    worklogTotal = new Map<number, number>(); // in minutes

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this, {
            tasksByColumn: computed,
        });
    }

    get tasksByColumn(): Record<number, Task[]> {
        const map: Record<number, Task[]> = {};
        for (const t of this.items) {
            (map[t.columnId] ??= []).push(t);
        }
        return map;
    }

    async load(projectId: number) {
        this.loading = true;
        try {
            const ui = this.root.ui;
            const filters: TaskFilters = {
                searchText: ui.searchText || undefined,
                type: ui.typeFilter,
                priority: ui.priorityFilter,
                userIds: ui.userFilters.length ? ui.userFilters : undefined,
            };
            const data = await apiFetchTasks(projectId, filters);
            runInAction(() => {
                this.items = data;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async create(payload: Omit<Task, "id" | "createdAt" | "updatedAt">) {
        const tmp: Task = {id: -Date.now(), createdAt: "", updatedAt: "", ...payload};
        runInAction(() => {
            this.items = [...this.items, tmp];
        });
        try {
            const created = await apiCreateTask(payload);
            runInAction(() => {
                this.items = this.items.filter(t => t.id !== tmp.id).concat(created);
            });
        } catch (e) {
            runInAction(() => {
                this.items = this.items.filter(t => t.id !== tmp.id);
            });
            throw e;
        }
    }

    async update(id: number, patch: Partial<Task>): Promise<Task> {
        const prev = this.items;
        runInAction(() => {
            this.items = this.items.map(t => t.id === id ? {...t, ...patch} : t);
        });
        try {
            const saved = await apiUpdateTask(id, patch);
            runInAction(() => {
                this.items = this.items.map(t => t.id === id ? saved : t);
            });
            return saved;
        } catch (e) {
            runInAction(() => {
                this.items = prev;
            });
            throw e;
        }
    }

    async moveTask(id: number, toColumnId: number) {
        const cur = this.items.find(t => t.id === id);
        if (!cur || cur.columnId === toColumnId) return;
        await this.update(id, {columnId: toColumnId});
    }

    async remove(id: number) {
        const keep = this.items;
        runInAction(() => {
            this.items = this.items.filter(t => t.id !== id);
        });
        try {
            await apiDeleteTask(id);
        } catch (e) {
            runInAction(() => {
                this.items = keep;
            });
            throw e;
        }
    }

    replace(updated: Task) {
        this.items = this.items.map(t => t.id === updated.id ? updated : t);
    }

    async fetchTaskWorklog(issueId: number): Promise<number> {
        const {totalMinutes} = await fetchTaskWorklog(issueId);
        runInAction(() => {
            this.worklogTotal.set(issueId, totalMinutes);
        });
        return totalMinutes;
    }

    getTaskWorklog(issueId: number): number {
        return this.worklogTotal.get(issueId) ?? 0;
    }

    async addWorklog(issueId: number, userId: number, minutes: number): Promise<number> {
        const {totalMinutes} = await logWork(issueId,userId,minutes);
        runInAction(() => {
            this.worklogTotal.set(issueId, totalMinutes);
        });

        const pid = this.root.ui.projectId;
        if(pid)
            try {this.root.worklog.refresh();} catch {}
        return totalMinutes;
    }
}
