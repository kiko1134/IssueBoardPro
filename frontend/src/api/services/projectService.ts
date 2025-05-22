import http from '../http';

export interface Project {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectDetails extends Project {
    adminId: number;
}

export interface CreateProjectParams {
    name: string;
    description?: string;
}

export const fetchProjects = async (): Promise<ProjectDetails[]> => {
    const {data} = await http.get<ProjectDetails[]>('/projects');
    return data;
};

export const createProject = async (
    params: CreateProjectParams
): Promise<Project> => {
    const {data} = await http.post<Project>('/projects', params);
    return data;
};

/** Update name/description (admin-only) */
export const updateProject = async (
    projectId: number,
    payload: { name?: string; description?: string }
): Promise<ProjectDetails> => {
    const { data } = await http.put<ProjectDetails>(
        `/projects/${projectId}`,
        payload
    );
    return data;
};

/** Delete a project (admin-only) */
export const deleteProject = async (projectId: number): Promise<void> => {
    await http.delete(`/projects/${projectId}`);
};

export const fetchProjectMembers = (projectId: number) =>
    http.get(`/projects/${projectId}/members`).then((res) => res.data);


export const addProjectMember = (
    projectId: number,
    payload: { email: string }
) =>
    http
        .post(`/projects/${projectId}/members`, payload)
        .then((res) => res.data);


export const fetchProjectDetails = async (
    projectId: number
): Promise<ProjectDetails> => {
    const {data} = await http.get<ProjectDetails>(`/projects/${projectId}`);
    return data;
};

export const deleteProjectMember = (
    projectId: number,
    userId: number
): Promise<void> => {
    return http.delete(`/projects/${projectId}/users/${userId}`);
};


