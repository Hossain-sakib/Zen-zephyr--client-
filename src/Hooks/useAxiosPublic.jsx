import axios from "axios";
const axiosPublic = axios.create({
    baseURL: 'https://zen-zepyr-server-hb66iu206-sakibs-projects-05a313dc.vercel.app'
})
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;