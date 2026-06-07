import axios from "axios";
import {  getSecure } from "./secureStorage"

export const api = axios.create({
    baseURL: "http://192.168.15.3:3000/api"
});

api.interceptors.request.use(async config => {
    const token = await getSecure ("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
}
        )