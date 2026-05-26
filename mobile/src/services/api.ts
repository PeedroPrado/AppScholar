import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.68.55.135:3000/api"
});