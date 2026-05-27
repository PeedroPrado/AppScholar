import { api } from "./api";

export async function createTeacher(
    data: any
) {
    const response = await api.post("/professores", data);

    return response.data;
}

export async function getTeachers() {
    const response = await api.get("/professores");

    return response.data;
}

export async function deleteTeacher(
    id: string
) {
    await api.delete(
        `/professores/${id}`
    );
}