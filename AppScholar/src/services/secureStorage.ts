import * as SecureStore from 'expo-secure-store';

// Salvar os dados criptografado 

export async function saveSecure (key: string, value: string): Promise <void>{
    await SecureStore.setItemAsync(key, value);
}

// Recupera os dados
export async function getSecure(key: string): Promise <string | null >{
    return await SecureStore.getItemAsync(key);
}

// Remove os dados (Logout)

export async function removeSecure (key:string): Promise<void>{
    await SecureStore.deleteItemAsync(key);
}