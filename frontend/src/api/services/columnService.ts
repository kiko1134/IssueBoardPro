import http from "../http";

export interface Column {
    id: number;
    name: string;
    projectId: number;
    position: number;
    createdAt: string;
    updatedAt: string;

}

export interface CreateColumnParams {
    name: string;
    projectId: number;
}

export interface UpdateColumnParams {
    name?: string;
    position?: number;
}

export const fetchColumns = async (projectId: number): Promise<Column[]> => {
    const {data} = await http.get<Column[]>(`/columns?projectId=${projectId}`);
    return data;
};

export const createColumn = async (
    params: CreateColumnParams
): Promise<Column> => {
    const {data} = await http.post('/columns', params);
    return data;
};

// export const updateColumnOrder = async (
//     id: number,
//     params: UpdateColumnParams
// ): Promise<Column> => {
//     const {data} = await http.put(`/columns/${id}`, params);
//     return data;
// };

export const reorderColumns = async (
    updates: { id: number; position: number }[]) => {
        await http.put('/columns/reorder', updates);
    }