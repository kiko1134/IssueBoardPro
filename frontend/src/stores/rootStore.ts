import { createContext, useContext } from "react";
import { BoardUIStore } from "./BoardUIStore";
import { ColumnStore } from "./ColumnStore";
import { TaskStore } from "./TaskStore";

export class RootStore {
    ui = new BoardUIStore(this);
    columns = new ColumnStore(this);
    tasks = new TaskStore(this);
}

const root = new RootStore();
export const RootStoreContext = createContext(root);

// удобни hooks
export const useRoot = () => useContext(RootStoreContext);
export const useUI = () => useRoot().ui;
export const useColumns = () => useRoot().columns;
export const useTasks = () => useRoot().tasks;

export default root;
