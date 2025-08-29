import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "./rootStore";
import {
    type Column,
    fetchColumns as apiFetchColumns,
    createColumn as apiCreateColumn,
    updateColumn as apiUpdateColumn,
    deleteColumn as apiDeleteColumn,
    reorderColumns as apiReorderColumns,
} from "../api/services/columnService";

export class ColumnStore {
    private root: RootStore;

    items: Column[] = [];
    loading = false;

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }

    async load(projectId: number) {
        this.loading = true;
        try {
            const cols = await apiFetchColumns(projectId);
            runInAction(() => { this.items = cols; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async create(name: string, projectId: number) {
        const created = await apiCreateColumn({ name, projectId });
        runInAction(() => { this.items = [...this.items, created]; });
    }

    async rename(id: number, name: string) {
        const updated = await apiUpdateColumn(id, { name });
        runInAction(() => {
            this.items = this.items.map(c => c.id === id ? updated : c);
        });
    }

    async remove(id: number) {
        const keep = this.items;
        runInAction(() => { this.items = this.items.filter(c => c.id !== id); });
        try { await apiDeleteColumn(id); }
        catch (e) { runInAction(() => { this.items = keep; }); throw e; }
    }

    async reorder(next: Column[]) {
        const prev = this.items;
        runInAction(() => { this.items = next; });
        try {
            await apiReorderColumns(next.map((c, i) => ({ id: c.id, position: i })));
        } catch (e) {
            runInAction(() => { this.items = prev; });
            throw e;
        }
    }
}
