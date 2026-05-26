import React, {
  createContext,
  useState,
  useEffect,
} from "react";

import { User } from "../types";

import {
  saveSecure,
  getSecure,
  removeSecure,
} from "../services/secureStorage";

import { login } from "../services/authService";

interface AuthContextData {
  user: User | null;
  isLoading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<boolean>;

  signOut: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({
  children,
}: Props) {

  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // Verifica sessão salva

  useEffect(() => {

    async function loadSession() {

      const savedUser =
        await getSecure("user_session");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setIsLoading(false);
    }

    loadSession();

  }, []);

  async function signIn(
    email: string,
    password: string
  ): Promise<boolean> {

    try {

      const response = await login({
        email,
        senha: password,
      });

      setUser(response.usuario);

      await saveSecure(
        "token",
        response.token
      );

      await saveSecure(
        "user_session",
        JSON.stringify(response.usuario)
      );

      return true;

    } catch (error) {

      console.log(error);

      return false;
    }
  }

  async function signOut() {

    await removeSecure("token");

    await removeSecure("user_session");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}