import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { app } from '../Configs/firebase.config';
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://zen-zephyr-api.netlify.app/api',
});
axiosPublic.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  await auth.authStateReady();
  if (auth.currentUser)
    config.headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  return config;
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
