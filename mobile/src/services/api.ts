import axios from "axios";
import {  getSecure } from "./secureStorage"

export const api = axios.create({
    baseURL: "http://10.68.55.89:3000/api"
});

api.interceptors.request.use(async config => {
    const token = await getSecure ("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
}
        )