import React, {createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { saveSecure, getSecure, removeSecure } from '../services/secureStorage';

// Usuário mockado para simular o login
const MOCK_USER: User = {
    email: 'admin@fatec.sp.gov.br',
    name: 'Administrador',
    role: 'admin',
};

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise <void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider ({ children }: {children: React.ReactNode }) {
    const [user, setUser ] = useState<User | null> (null);
    const [isLoading, setIsLoading ] = useState (true);

    //useEffect para verificar se existe sessão salva

    useEffect(() => {
        async function loadSession () {
            const savedUser = await getSecure('user_session');
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
            setIsLoading(false);
        }
        loadSession();
    }, []);

    async function signIn(email: string, password: string): Promise <boolean>{
        //validação mockada
        if (email === 'admin@fatec.sp.gov.br' && password === '1234') {
            await saveSecure('user_session', JSON.stringify(MOCK_USER));
            setUser(MOCK_USER);
            return true;
        }
        return false; 
    }
    async function signOut(){
        await removeSecure('user_session');
        setUser(null);
    }

    return(
        <AuthContext.Provider value = {{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
    

//Hook costumizado para o uso em qualquer tela

export function useAuth() {
    return useContext(AuthContext);
}