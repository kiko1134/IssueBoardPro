import { makeAutoObservable, runInAction } from "mobx";
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    type ProjectDetails,
    type CreateProjectParams,
} from "../api/services/projectService";

export class ProjectStore {
    items: ProjectDetails[] = [];
    loading = false;

    constructor() { makeAutoObservable(this); }

    async fetchAll() {
        this.loading = true;
        try {
            const data = await fetchProjects();
            runInAction(() => { this.items = data; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async create(payload: CreateProjectParams) {
        const created = await createProject(payload);
        await this.fetchAll();
        return created;
    }

    async update(id: number, payload: { name?: string; description?: string }) {
        const updated = await updateProject(id, payload);
        await this.fetchAll();
        return updated;
    }

    async remove(id: number) {
        await deleteProject(id);
        await this.fetchAll();
    }
}
