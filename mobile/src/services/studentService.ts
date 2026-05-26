import { api } from './api';

export async function createStudent(data: any) {

    const response = await api.post("/alunos", data);

    return response.data;
}

export async function getStudents() {

    const response = await api.get("/alunos");

    return response.data;
    
}

export async function deleteStudent(
    id: string
) {
    await api.delete(
        `/alunos/${id}`
    );
}