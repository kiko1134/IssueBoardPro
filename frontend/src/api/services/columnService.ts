import http from "../http";

export interface Column {
    id: number;
    name: string;
    projectId: number;
    createdAt: string;
    updatedAt: string;

}

export interface CreateColumnParams {
    name: string;
    projectId: number;
}

export const fetchColumns = async (projectId: number): Promise<Column[]> => {
    const { data } = await http.get<Column[]>(`/columns?projectId=${projectId}`);
    return data;
};

export const createColumn = async (
    params: CreateColumnParams
): Promise<Column> => {
    const { data } = await http.post('/columns', params);
    return data;
};