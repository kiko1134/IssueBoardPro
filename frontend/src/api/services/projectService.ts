import http from '../http';

export interface Project {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectParams {
    name: string;
    description?: string;
}
export const fetchProjects = async (): Promise<Project[]> => {
    const { data } = await http.get<Project[]>('/projects');
    return data;
};

export const createProject = async (
    params: CreateProjectParams
): Promise<Project> => {
    const { data } = await http.post<Project>('/projects', params);
    return data;
};

export const fetchProjectMembers = (projectId: number) =>
    http.get(`/projects/${projectId}/members`).then((res) => res.data);

export const fetchUsers = () => http.get("/users").then((res) => res.data);

export const addProjectMember = (
    projectId: number,
    payload: { email: string }
) =>
    http
        .post(`/projects/${projectId}/members`, payload)
        .then((res) => res.data);
