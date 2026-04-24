import axios from "axios";


const axiosInstance = axios.create({
    baseURL:"https://jdsapi.techportfolio.in/JaiDevDental"
    // baseURL:"http://localhost:5006/JaiDevDental"
})
export default axiosInstance