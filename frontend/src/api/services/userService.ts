import http from '../http';

export interface LoginParams {
    email: string;
    password: string;
}

export interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

export const login = async ({ email, password }: LoginParams) => {
    const { data } = await http.post<{ token: string; username: string }>('/users/login', { email, password });
    return data;
};

export const register = async ({ username, email, password }: RegisterParams) => {
    const { data } = await http.post<{ id: number; username: string; email: string }>('/users', {
        username,
        email,
        password,
    });
    return data;
};
