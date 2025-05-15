import http from "../http";

export interface WorkLogDetail {
    issueId: number;
    issueTitle: string;
    minutes: number;
    createdAt: string;
}

export const fetchUserWorklogs = async (
    projectId: number,
    userId: number
): Promise<WorkLogDetail[]> => {
    const { data } = await http.get<WorkLogDetail[]>(
        `/projects/${projectId}/users/${userId}/worklogs`
    );
    return data;
};