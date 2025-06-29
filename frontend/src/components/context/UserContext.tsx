import React, {createContext, ReactNode, useCallback, useEffect, useState} from 'react';
import {http} from '../../api/http';

export interface User {
    id: number;
    username: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    refreshUser: async () => {
    },
});

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);

    const refreshUser = useCallback(async () => {
        try {
            const {data} = await http.get<User>('/auth/me');
            setUser(data);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const id = http.interceptors.response.use(
            r => r,
            err => {
                if (err.response?.status === 401) {
                    setUser(null);
                }
                return Promise.reject(err);
            }
        );
        return () => { http.interceptors.response.eject(id); };
    }, []);

    return (
        <UserContext.Provider value={{user, refreshUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
