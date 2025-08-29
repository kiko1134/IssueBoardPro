import {makeAutoObservable} from "mobx";
import type {RootStore} from "./rootStore";

export class BoardUIStore {
    private root: RootStore;

    projectId: number | null = null;

    // филтри
    searchText = "";
    typeFilter: string | undefined = undefined;
    priorityFilter: string | undefined = undefined;
    userFilters: number[] = [];

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }

    setProjectId(id: number | null) {
        this.projectId = id;
    }

    setSearchText(v: string) {
        this.searchText = v;
    }

    clearSearch() {
        this.searchText = "";
    }

    setTypeFilter(v?: string) {
        this.typeFilter = v;
    }

    setPriorityFilter(v?: string) {
        this.priorityFilter = v;
    }

    setUserFilters(arr: number[]) {
        this.userFilters = arr;
    }

    clearAllFilters() {
        this.searchText = "";
        this.typeFilter = undefined;
        this.priorityFilter = undefined;
        this.userFilters = [];
    }
}
