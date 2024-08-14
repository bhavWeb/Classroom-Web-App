import axios from "axios"


const baseURL = import.meta.env.VITE_BACKEND_API_URL;

const apiRequest = axios.create({
    baseURL : baseURL
})

export default apiRequest