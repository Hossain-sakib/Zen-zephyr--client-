import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: 'https://zen-zepyr-server-hb66iu206-sakibs-projects-05a313dc.vercel.app'
})
const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth()
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token')
        console.log('request stopped by interceptors', token);
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async function (error) {
        const status = error.response.status
        console.log('status error in the interceptor', status);
        if (status === 401 || status === 403) {
            await logoutUser();
            navigate('/login');
        }
        return Promise.reject(error);
    });
    return axiosSecure;
};

export default useAxiosSecure;