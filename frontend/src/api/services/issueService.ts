import http from '../http';

export interface Task {
    id: number;
    title: string;
    description?: string;
    projectId: number;
    statusId: number;
    columnId: number;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Bug' | 'Feature' | 'Task';
    workLog: number;
    createdAt: string;
    updatedAt: string;
    assignedTo: number;
    assignedBy: number;
}

export interface CreateTaskParams {
    title: string;
    description?: string;
    projectId: number;
    statusId: number;
    columnId: number;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Bug' | 'Feature' | 'Task';
    assignedTo?: number;
    assignedBy?: number;
    workLog?: number;
}

export interface UserWorklog {
    id: number;
    username: string;
    totalMinutes: number;
}

export interface LogWorkResponse {
    totalMinutes: number;
}


export const fetchTasks = async (projectId: number): Promise<Task[]> => {
    const {data} = await http.get<Task[]>(`/issues?id=${projectId}`);
    return data;
};

export const createTask = async (
    params: CreateTaskParams
): Promise<Task> => {
    const {data} = await http.post<Task>('/issues', params);
    return data;
};

export const updateTask = async (
    id: number,
    params: Partial<CreateTaskParams>
): Promise<Task> => {
    const {data} = await http.put<Task>(`/issues/${id}`, params);
    return data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await http.delete(`/issues/${id}`);
}

// export const logWork = async (issueId: number, minutes: number) => {
//     const {data} = await http
//         .post<{ totalMinutes: number }>(`/issues/${issueId}/worklog`, {minutes})
//     return data;
// };

export const logWork = async (
    issueId: number,
    userId: number,
    minutes: number
): Promise<LogWorkResponse> => {
    const { data } = await http.post<LogWorkResponse>(
        `/issues/${issueId}/worklog`,
        { userId, minutes }
    );
    return data;
};

export const fetchProjectWorklogs = async(projectId: number) =>{
    const {data} = await http.get<UserWorklog[]>(`/projects/${projectId}/worklogs`);
    return data;
};

export const fetchTaskWorklog = async (
    issueId: number
): Promise<LogWorkResponse> => {
    const { data } = await http.get<LogWorkResponse>(`/issues/${issueId}/worklog`);
    return data;
};
