import { api } from "./api";

interface LoginDTO {
    email:string;
    senha: string;
}

export async function login(data: LoginDTO) {

    const response = await api.post(
        "/login",
        data
    );

    return response.data;
}