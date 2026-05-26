import axios from "axios";

export async function buscarCEP(cep: string){
    const cepLimpo = cep.replace(/\D/g, "");
    const reponse = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    return reponse.data;

}
