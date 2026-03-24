import axios from "axios";


const axiosInstance = axios.create({
    baseURL:"http://localhost:5006/JaiDevDental"
})
export default axiosInstance