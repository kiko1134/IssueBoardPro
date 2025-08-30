import { makeAutoObservable } from "mobx";
import { http } from "../api/http";
import { login as apiLogin, type LoginParams } from "../api/services/userService";

export interface Me { id: number; username: string; email: string; }

export class UserStore {
    user: Me | null = null;
    loading = false;
    private axiosInterceptorId: number | null = null;

    constructor() {
        makeAutoObservable(this);
        // 401 → изчисти потребителя
        this.axiosInterceptorId = http.interceptors.response.use(
            r => r,
            err => {
                if (err?.response?.status === 401) this.user = null;
                return Promise.reject(err);
            }
        );
    }
    destroy() {
        if (this.axiosInterceptorId !== null) {
            http.interceptors.response.eject(this.axiosInterceptorId);
            this.axiosInterceptorId = null;
        }
    }
    get isAuthenticated() { return !!this.user; }

    async refreshUser() {
        this.loading = true;
        try {
            const { data } = await http.get<Me>("/auth/me");
            this.user = data;
        } catch {
            this.user = null;
        } finally {
            this.loading = false;
        }
    }

    // /users/login връща { token, username } — токенът е в cookie; ползваме cookie-то
    async login(params: LoginParams) {
        this.loading = true;
        try {
            const { username } = await apiLogin(params);
            await this.refreshUser();
            return { username };
        } finally {
            this.loading = false;
        }
    }

    async logout() {
        try { await http.post("/auth/logout"); } catch {}
        this.user = null;
    }
}
