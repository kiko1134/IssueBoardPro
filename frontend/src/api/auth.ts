import axiosInstance from "./axiosInstance";

export const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password});
    return response.data;
}

export const register = async (username: string, email: string, password: string) => {
    const response = await axiosInstance.post('/auth/register', {username, email, password});
    return response.data;
};