import http from './http';

export interface Task {
    id: number;
    title: string;
    description?: string;
    projectId: number;
    statusId: number;
    columnId: number;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Bug' | 'Feature' | 'Task';
    workLog?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskParams {
    title: string;
    description?: string;
    projectId: number;
    statusId: number;
    columnId: number;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Bug' | 'Feature' | 'Task';
    workLog?: number;
}

export const fetchTasks = async (projectId: number): Promise<Task[]> => {
    const { data } = await http.get<Task[]>(`/issues?id=${projectId}`);
    return data;
};

export const createTask = async (
    params: CreateTaskParams
): Promise<Task> => {
    const { data } = await http.post<Task>('/issues', params);
    return data;
};

export const updateTask = async (
    id: number,
    params: Partial<CreateTaskParams>
): Promise<Task> => {
    const { data } = await http.put<Task>(`/issues/${id}`, params);
    return data;
};
