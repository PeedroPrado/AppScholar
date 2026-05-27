import {api} from "./api";

export async function createSubject(
    data:any
){
    const response = await api.post("/disciplinas", data);

    return response.data;
}

export async function getSubjects(){
    const response = await api.get("/disciplinas");

    return response.data;
}

export async function deleteSubject( 
    id: string
){
    await api.delete(`/disciplinas/${id}`); 
}
