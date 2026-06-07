import axios from "axios";

export async function getEstados() {

    const reponse = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
    );

    return reponse.data.sort((a: any, b:any) => a.sigla.localeCompare(b.sigla));
} 

export async function getCidades(
    uf: string
) {
    const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );

    return response.data;
}