import { makeAutoObservable } from "mobx";
import type { RootStore } from "./rootStore";

export class BoardUIStore {
    private root: RootStore;

    projectId: number | null = null;
    projectName = "";
    activeMenuKey: "board" | "members" | "worklog" = "board";
    siderCollapsed = false;

    // филтри
    searchText = "";
    typeFilter: string | undefined = undefined;
    priorityFilter: string | undefined = undefined;
    userFilters: number[] = [];

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }

    setProjectId(id: number | null) { this.projectId = id; }
    setProjectName(n: string) { this.projectName = n; }
    setActiveMenu(k: "board" | "members" | "worklog") { this.activeMenuKey = k; }
    setSiderCollapsed(v: boolean) { this.siderCollapsed = v; }

    setSearchText(v: string) { this.searchText = v; }
    clearSearch() { this.searchText = ""; }
    setTypeFilter(v?: string) { this.typeFilter = v; }
    setPriorityFilter(v?: string) { this.priorityFilter = v; }
    setUserFilters(arr: number[]) { this.userFilters = arr; }
    clearAllFilters() {
        this.searchText = "";
        this.typeFilter = undefined;
        this.priorityFilter = undefined;
        this.userFilters = [];
    }
}
