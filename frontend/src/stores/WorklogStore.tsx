import {makeAutoObservable, runInAction} from "mobx";
import {fetchProjectWorklogs} from "../api/services/issueService";
import {fetchUserWorklogs} from "../api/services/worklogService";

export type UserWorklog = { id: number; username: string; totalMinutes: number; };
export type WorkLogDetail = { issueId: number; issueTitle: string; minutes: number; createdAt: string; };

export class WorklogStore {
    summary: UserWorklog[] = [];
    details = new Map<number, WorkLogDetail[]>();

    loadingSummary = false;
    loadingDetails = false;

    initialized = false;
    currentProjectId: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async load(projectId: number) {
        this.currentProjectId = projectId;

        this.summary = [];
        this.details.clear();

        this.loadingSummary = true;
        this.loadingDetails = false;

        try {
            const sum = await fetchProjectWorklogs(projectId);
            runInAction(() => {
                this.summary = sum;
            });

            this.loadingDetails = true;
            const entries = await Promise.all(
                sum.map(u => fetchUserWorklogs(projectId, u.id).then(rows => [u.id, rows] as const))
            );
            runInAction(() => {
                this.details.clear();
                for (const [uid, rows] of entries) this.details.set(uid, rows);
            });
        } finally {
            runInAction(() => {
                this.loadingSummary = false;
                this.loadingDetails = false;
                this.initialized = true;
            });
        }
    }

    refresh(){
        if(this.currentProjectId){
            void this.load(this.currentProjectId);
        }
    }


    getDetails(userId: number) {
        return this.details.get(userId) ?? [];
    }
}
