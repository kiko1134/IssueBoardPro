// src/context/UserContext.tsx
import React, {createContext, ReactNode, useCallback, useState} from 'react';
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

    // Викаме го след login, за да заредим текущия user
    const refreshUser = useCallback(async () => {
        try {
            const {data} = await http.get<User>('/auth/me');
            setUser(data);
        } catch {
            setUser(null);
        }
    }, []);

    return (
        <UserContext.Provider value={{user, refreshUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
