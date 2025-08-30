import { createContext, useContext } from "react";
import { BoardUIStore } from "./BoardUIStore";
import { ColumnStore } from "./ColumnStore";
import { TaskStore } from "./TaskStore";
import {ProjectStore} from "./ProjectStore";
import {UserStore} from "./UserStore";
import {WorklogStore} from "./WorklogStore";

export class RootStore {
    ui = new BoardUIStore(this);
    columns = new ColumnStore(this);
    tasks = new TaskStore(this);
    projects = new ProjectStore();
    user = new UserStore();
    worklog = new WorklogStore();
}

const root = new RootStore();
export const RootStoreContext = createContext(root);

export const useRoot = () => useContext(RootStoreContext);
export const useUI = () => useRoot().ui;
export const useColumns = () => useRoot().columns;
export const useTasks = () => useRoot().tasks;
export const useProjects = () => useRoot().projects;
export const useUser = () => useRoot().user;
export const useWorklog = () => useRoot().worklog;

export default root;
