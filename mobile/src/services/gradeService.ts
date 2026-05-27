import { api } from "./api";

export async function createGrade(
  data: any
) {

  const response = await api.post(
    "/notas",
    data
  );

  return response.data;
}

export async function getGrades() {

  const response = await api.get(
    "/notas"
  );

  return response.data;
}

export async function deleteGrade(
  id: string
) {

  await api.delete(
    `/notas/${id}`
  );

}

export async function updateGrade(
  id: number,
  data: {
    nota1: number;
    nota2: number;
  }
) {

  const response =
    await api.put(
      `/notas/${id}`,
      data
    );

  return response.data;
}